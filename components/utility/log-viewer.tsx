"use client";

import Convert from "ansi-to-html";
import DOMPurify from "dompurify";
import { useEffect, useRef } from "react";

interface LogViewerProps {
  logFileUrl: string;
}

const CHUNK_SIZE = 300; // Process 300 lines at a time

export function LogViewer({ logFileUrl }: LogViewerProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const converterRef = useRef<Convert | null>(null);

  useEffect(() => {
    // Initialize ANSI to HTML converter
    // newline: false because we're using whiteSpace: pre-wrap in CSS
    converterRef.current = new Convert({
      fg: "#FFF",
      bg: "#000",
      newline: false,
      escapeXML: true,
      stream: false,
    });

    const preElement = preRef.current;
    if (!preElement) return;

    let buffer = "";
    let lineCount = 0;
    let chunkBuffer: string[] = [];

    const processChunk = () => {
      if (chunkBuffer.length === 0) return;

      // Process each line individually and wrap in a div with log-line class
      for (const line of chunkBuffer) {
        // Convert ANSI to HTML for this line
        const htmlLine = converterRef.current?.toHtml(line) ?? line;

        // Sanitize HTML to prevent XSS while allowing ANSI color spans
        // Only allow span tags with style attribute for ANSI colors
        const sanitizedHtml = DOMPurify.sanitize(htmlLine, {
          ALLOWED_TAGS: ["span"],
          ALLOWED_ATTR: ["style"],
        });

        // Create a div for this line with the log-line class
        const lineDiv = document.createElement("div");
        lineDiv.className = "log-line";
        lineDiv.innerHTML = sanitizedHtml;

        // Append to the pre element
        preElement.appendChild(lineDiv);
      }

      // Clear chunk buffer
      chunkBuffer = [];
    };

    const fetchAndStream = async () => {
      try {
        const response = await fetch(logFileUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch log file: ${response.statusText}`);
        }

        if (!response.body) {
          throw new Error("Response body is null");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            // Process remaining buffer
            if (buffer) {
              chunkBuffer.push(buffer);
              lineCount++;
              if (lineCount >= CHUNK_SIZE) {
                processChunk();
                lineCount = 0;
              }
            }
            // Process final chunk
            if (chunkBuffer.length > 0) {
              processChunk();
            }
            break;
          }

          // Decode chunk
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          // Process complete lines
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // Keep incomplete line in buffer

          for (const line of lines) {
            chunkBuffer.push(line);
            lineCount++;

            // Process chunk when it reaches the size
            if (lineCount >= CHUNK_SIZE) {
              processChunk();
              lineCount = 0;
            }
          }
        }
      } catch (error) {
        console.error("Error streaming log file:", error);
        const errorDiv = document.createElement("div");
        errorDiv.style.color = "#ff6b6b";
        errorDiv.textContent = `Error loading log file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`;
        preElement.appendChild(errorDiv);
      }
    };

    fetchAndStream();
  }, [logFileUrl]);

  return (
    <pre
      ref={preRef}
      className="log-content"
      style={{
        margin: 0,
        padding: "1rem",
        backgroundColor: "#000",
        color: "#FFF",
        fontFamily: "monospace",
        fontSize: "0.875rem",
        lineHeight: "1.5",
        overflow: "auto",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        minHeight: "100vh",
      }}
    />
  );
}

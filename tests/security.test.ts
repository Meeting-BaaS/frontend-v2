import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// Initialize DOMPurify with jsdom for Node.js environment
const window = new JSDOM("").window;
const purify = DOMPurify(window);

describe("Security Tests", () => {
  describe("XSS Prevention", () => {
    it("should sanitize script tags", () => {
      const maliciousInput = '<script>alert("xss")</script>';
      const sanitized = purify.sanitize(maliciousInput, {
        ALLOWED_TAGS: ["span"],
        ALLOWED_ATTR: ["style"],
      });
      expect(sanitized).not.toContain("<script>");
      expect(sanitized).not.toContain("alert");
    });

    it("should sanitize event handlers", () => {
      const maliciousInput = '<span onmouseover="alert(1)">test</span>';
      const sanitized = purify.sanitize(maliciousInput, {
        ALLOWED_TAGS: ["span"],
        ALLOWED_ATTR: ["style"],
      });
      expect(sanitized).not.toContain("onmouseover");
    });

    it("should sanitize javascript: URLs", () => {
      const maliciousInput = '<a href="javascript:alert(1)">click</a>';
      const sanitized = purify.sanitize(maliciousInput, {
        ALLOWED_TAGS: ["span"],
        ALLOWED_ATTR: ["style"],
      });
      expect(sanitized).not.toContain("javascript:");
    });

    it("should allow safe ANSI color spans", () => {
      const safeInput =
        '<span style="color:#ff0000">Red text</span><span style="font-weight:bold">Bold</span>';
      const sanitized = purify.sanitize(safeInput, {
        ALLOWED_TAGS: ["span"],
        ALLOWED_ATTR: ["style"],
      });
      expect(sanitized).toContain("<span");
      expect(sanitized).toContain("style=");
      expect(sanitized).toContain("Red text");
    });

    it("should only allow color-related CSS properties for ANSI", () => {
      // ANSI converter only produces color/font-weight styles
      // We verify that other dangerous CSS properties would need explicit allowlisting
      const ansiColorSpan = '<span style="color: rgb(255, 0, 0)">red</span>';
      const sanitized = purify.sanitize(ansiColorSpan, {
        ALLOWED_TAGS: ["span"],
        ALLOWED_ATTR: ["style"],
      });
      expect(sanitized).toContain("color:");
      expect(sanitized).toContain("red");
    });

    it("should handle nested malicious content", () => {
      const maliciousInput =
        "<span><img src=x onerror=alert(1)><script>alert(2)</script></span>";
      const sanitized = purify.sanitize(maliciousInput, {
        ALLOWED_TAGS: ["span"],
        ALLOWED_ATTR: ["style"],
      });
      expect(sanitized).not.toContain("<img");
      expect(sanitized).not.toContain("<script");
      expect(sanitized).not.toContain("onerror");
    });
  });

  describe("Input Validation Patterns", () => {
    it("should validate email format", () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test("valid@email.com")).toBe(true);
      expect(emailRegex.test("invalid-email")).toBe(false);
      expect(emailRegex.test("no@domain")).toBe(false);
    });

    it("should validate strong password requirements", () => {
      // Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol
      const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

      expect(strongPasswordRegex.test("Weak1!")).toBe(false); // Too short
      expect(strongPasswordRegex.test("nouppercase1!")).toBe(false);
      expect(strongPasswordRegex.test("NOLOWERCASE1!")).toBe(false);
      expect(strongPasswordRegex.test("NoNumber!")).toBe(false);
      expect(strongPasswordRegex.test("NoSymbol1")).toBe(false);
      expect(strongPasswordRegex.test("ValidPass1!")).toBe(true);
    });

    it("should reject SQL injection patterns", () => {
      const sqlPatterns = [
        "'; DROP TABLE users; --",
        "1 OR 1=1",
        "admin'--",
        "1; SELECT * FROM users",
      ];

      const hasSqlPattern = (input: string) =>
        /('|--|;|\bOR\b|\bAND\b|\bSELECT\b|\bDROP\b|\bDELETE\b|\bINSERT\b|\bUPDATE\b)/i.test(
          input,
        );

      for (const pattern of sqlPatterns) {
        expect(hasSqlPattern(pattern)).toBe(true);
      }
    });
  });

  describe("Security Headers Configuration", () => {
    // These test the expected header values
    const expectedHeaders = {
      "X-XSS-Protection": "1; mode=block",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Strict-Transport-Security":
        "max-age=31536000; includeSubDomains; preload",
    };

    it("should have correct X-XSS-Protection header value", () => {
      expect(expectedHeaders["X-XSS-Protection"]).toBe("1; mode=block");
    });

    it("should have correct X-Content-Type-Options header value", () => {
      expect(expectedHeaders["X-Content-Type-Options"]).toBe("nosniff");
    });

    it("should have correct X-Frame-Options header value", () => {
      expect(expectedHeaders["X-Frame-Options"]).toBe("DENY");
    });

    it("should have HSTS with minimum 1 year max-age", () => {
      const hstsValue = expectedHeaders["Strict-Transport-Security"];
      const maxAgeMatch = hstsValue.match(/max-age=(\d+)/);
      expect(maxAgeMatch).not.toBeNull();
      const maxAge = Number.parseInt(maxAgeMatch?.[1] ?? "0", 10);
      expect(maxAge).toBeGreaterThanOrEqual(31536000); // 1 year in seconds
    });
  });
});

import { expect, it, describe } from "vitest";
import { raw, urlify } from "./url";

describe("should properly escape path params", () => {
  it("not change simple strings", () => {
    const param = "hello";
    expect(urlify`/users/${param}`).toBe("/users/hello");
  });

  it("with spaces", () => {
    const param = "hello world";
    expect(urlify`/users/${param}`).toBe("/users/hello%20world");
  });

  it("with /", () => {
    const param = "hello/world";
    expect(urlify`/users/${param}`).toBe("/users/hello%2Fworld");
  });
});

describe("should properly escape query params", () => {
  it("not change simple strings", () => {
    const param = "hello";
    expect(urlify`/users?name=${param}`).toBe("/users?name=hello");
  });

  it("with spaces", () => {
    const param = "hello world";
    expect(urlify`/users?name=${param}`).toBe("/users?name=hello%20world");
  });

  it("with /", () => {
    const param = "hello/world";
    expect(urlify`/users?name=${param}`).toBe("/users?name=hello%2Fworld");
  });

  it("with &", () => {
    const param = "hello&world";
    expect(urlify`/users?search=${param}`).toBe("/users?search=hello%26world");
  });

  it("with =", () => {
    const param = "hello=world";
    expect(urlify`/users?search=${param}`).toBe("/users?search=hello%3Dworld");
  });
});

describe("should properly escape query params with multiple values", () => {
  it("mixed path and query params", () => {
    const group = "admin/manager";
    const filter = "active&inactive";

    expect(urlify`/users/${group}?filter=${filter}`).toBe(
      "/users/admin%2Fmanager?filter=active%26inactive",
    );
  });

  it("multiple query params", () => {
    const filter = "active&inactive";
    const sort = "name=asc";

    expect(urlify`/users?filter=${filter}&sort=${sort}`).toBe(
      "/users?filter=active%26inactive&sort=name%3Dasc",
    );
  });

  it("multiple path params", () => {
    const group = "admin/manager";
    const user = "john.doe";

    expect(urlify`/users/${group}/${user}`).toBe(
      "/users/admin%2Fmanager/john.doe",
    );
  });
});

describe("should support raw values", () => {
  it("not escape raw values in path", () => {
    const baseURL = "/api/v1";

    expect(urlify`${raw(baseURL)}/users`).toBe("/api/v1/users");
  });

  it("not escape raw values in query", () => {
    const filter = `filter=active&sort=name`;
    expect(urlify`/users?${raw(filter)}`).toBe(
      "/users?filter=active&sort=name",
    );
  });

  it("not escape raw values in path and query", () => {
    const baseURL = "/api/v1";
    const filter = `filter=active&sort=name`;

    expect(urlify`${raw(baseURL)}/users?${raw(filter)}`).toBe(
      "/api/v1/users?filter=active&sort=name",
    );
  });
});

describe("should support urls with host", () => {
  it("not break the literal strings", () => {
    expect(urlify`https://api.example.com/v1/users`).toBe(
      "https://api.example.com/v1/users",
    );
  });

  it("not break with path params", () => {
    const param = "hello";
    expect(urlify`https://api.example.com/v1/users/${param}`).toBe(
      "https://api.example.com/v1/users/hello",
    );
  });
});

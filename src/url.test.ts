import { expect, it, describe } from "vitest";
import { raw, urlify } from "./url";

describe("should properly escape path params", () => {
  it.each([
    ["not change simple strings", "hello", "/users/hello"],
    ["with spaces", "hello world", "/users/hello%20world"],
    ["with /", "hello/world", "/users/hello%2Fworld"],
  ])("%s", (_, param, expected) => {
    expect(urlify`/users/${param}`).toBe(expected);
  });
});

describe("should properly escape query params", () => {
  it.each([
    ["not change simple strings", "hello", "/users?q=hello"],
    ["with spaces", "hello world", "/users?q=hello%20world"],
    ["with /", "hello/world", "/users?q=hello%2Fworld"],
    ["with &", "hello&world", "/users?q=hello%26world"],
    ["with =", "hello=world", "/users?q=hello%3Dworld"],
  ])("%s", (_, param, expected) => {
    expect(urlify`/users?q=${param}`).toBe(expected);
  });
});

describe("should properly escape query params with multiple values", () => {
  it.each([
    [
      "mixed path and query params",
      () => urlify`/users/${"admin/manager"}?filter=${"active&inactive"}`,
      "/users/admin%2Fmanager?filter=active%26inactive",
    ],
    [
      "multiple query params",
      () => urlify`/users?filter=${"active&inactive"}&sort=${"name=asc"}`,
      "/users?filter=active%26inactive&sort=name%3Dasc",
    ],
    [
      "multiple path params",
      () => urlify`/users/${"admin/manager"}/${"john.doe"}`,
      "/users/admin%2Fmanager/john.doe",
    ],
  ])("%s", (_, build, expected) => {
    expect(build()).toBe(expected);
  });
});

describe("should support raw values", () => {
  it.each([
    [
      "not escape raw values in path",
      () => urlify`${raw("/api/v1")}/users`,
      "/api/v1/users",
    ],
    [
      "not escape raw values in query",
      () => urlify`/users?${raw("filter=active&sort=name")}`,
      "/users?filter=active&sort=name",
    ],
    [
      "not escape raw values in path and query",
      () => urlify`${raw("/api/v1")}/users?${raw("filter=active&sort=name")}`,
      "/api/v1/users?filter=active&sort=name",
    ],
  ])("%s", (_, build, expected) => {
    expect(build()).toBe(expected);
  });
});

describe("should handle different value types", () => {
  it.each([
    ["string", () => urlify`/users/${"hello world"}`, "/users/hello%20world"],
    ["number", () => urlify`/users/${42}`, "/users/42"],
    ["boolean", () => urlify`/users?active=${true}`, "/users?active=true"],
  ])("%s", (_, build, expected) => {
    expect(build()).toBe(expected);
  });
});

describe("should support urls with host", () => {
  it.each([
    [
      "not break the literal strings",
      () => urlify`https://api.example.com/v1/users`,
      "https://api.example.com/v1/users",
    ],
    [
      "not break with path params",
      () => urlify`https://api.example.com/v1/users/${"hello"}`,
      "https://api.example.com/v1/users/hello",
    ],
  ])("%s", (_, build, expected) => {
    expect(build()).toBe(expected);
  });
});

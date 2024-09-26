/**
 * A class that holds a raw value that should not be URI-encoded.
 *
 * This class is used in conjunction with the `urlify` function to wrap values
 * that are already URI-encoded or are meant to be inserted without encoding.
 *
 * @example
 * const baseUrl = new RawValue("/api/v1");
 * const endpoint = urlify`${baseUrl}/users/${userId}`;
 */
class RawValue {
  constructor(public readonly raw: unknown) {}
}

/**
 * This function is used when constructing URIs where certain values should
 * be inserted without URI encoding. It can be used either by assigning it to
 * a variable or directly inline within the `urlify` template literal.
 *
 * @param {unknown} value - The value to wrap as raw.
 * @returns {RawValue} A `RawValue` instance containing the provided value.
 *
 * @example
 * // Using raw() inline
 * const baseUrl = "/api/v1";
 * const endpoint = urlify`${raw(baseUrl)}/users`;
 *
 * @example
 * // Using raw() with a variable
 * const baseUrl = raw("/api/v1");
 * const endpoint = urlify`${baseUrl}/users`;
 */
export function raw(value: unknown): RawValue {
  return new RawValue(value);
}

/**
 * This function will construct a URI encoded string from the provided template.
 *
 * @param {TemplateStringsArray} strings - The template strings array.
 * @param {...any} values - The values to insert into the template.
 *
 * @returns {string} The URI encoded string.
 *
 * @example
 * urlify`https://example.com/users/${userId}`;
 *
 * @example
 * urlify`https://example.com/users?id=${userId}`;
 *
 * @example
 * // Use raw() to prevent URI encoding
 * urlify`${raw(baseUrl)}/users?id=${userId}`;
 */
export function urlify(
  strings: TemplateStringsArray,
  ...values: any[]
): string {
  // use a array as "string builder" because, guess what, js std::lib sucks!
  const builder = new Array(strings.length + values.length);

  let valueIdx = 0;

  for (const str of strings) {
    builder.push(str);
    if (valueIdx < values.length) {
      const value = values[valueIdx++];
      builder.push(
        value instanceof RawValue ? value.raw : encodeURIComponent(value),
      );
    }
  }

  return builder.join("");
}

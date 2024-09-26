class RawValue {
  constructor(public readonly raw: unknown) {}
}

export function raw(value: unknown): RawValue {
  return new RawValue(value)
}

export function uri(strings: TemplateStringsArray, ...values: any[]): string {
  // use a array as "string builder" because, guess what, js std::lib sucks!
  const builder = new Array(strings.length + values.length)

  let valueIdx = 0;

  for (const str of strings) {
    builder.push(str)
    if (valueIdx < values.length) {
      const value = values[valueIdx++];
      builder.push(
        value instanceof RawValue ? value.raw :encodeURIComponent(value),
      )
    }
  }

  return builder.join('')
}

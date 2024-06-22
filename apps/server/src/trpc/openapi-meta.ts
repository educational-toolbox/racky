import type { OpenApiMeta, OpenApiMethod } from 'trpc-openapi';

export class OpenapiMetaBuilder {
  private meta: NonNullable<OpenApiMeta['openapi']>;

  static fromExisting(meta: OpenApiMeta['openapi']) {
    return new OpenapiMetaBuilder('', meta);
  }

  constructor(
    private readonly root: string,
    override?: OpenApiMeta['openapi'],
  ) {
    this.meta = {
      method: 'GET',
      path: `/${root}`,
      enabled: true,
      protect: false,
      ...override,
    };
  }

  method(method: OpenApiMethod): OpenapiMetaBuilder {
    this.meta.method = method;
    return this;
  }

  summary(summary: string): OpenapiMetaBuilder {
    this.meta.summary = summary;
    return this;
  }

  description(description: string): OpenapiMetaBuilder {
    this.meta.description = description;
    return this;
  }

  tags(...tags: [string, ...string[]]): OpenapiMetaBuilder {
    this.meta.tags = this._unique([...(this.meta.tags ?? []), ...tags]);
    return this;
  }

  segments(...segments: [string, ...string[]]): OpenapiMetaBuilder {
    this.meta.path = `/${this.root}/${segments.join('/')}`;
    return this;
  }

  deprecated(): OpenapiMetaBuilder {
    this.meta.deprecated = true;
    return this;
  }

  disable(): OpenapiMetaBuilder {
    this.meta.enabled = false;
    return this;
  }

  protected(): OpenapiMetaBuilder {
    this.meta.protect = true;
    return this;
  }

  clone(): OpenapiMetaBuilder {
    return new OpenapiMetaBuilder(this.root, this.meta);
  }

  build(): NonNullable<OpenApiMeta['openapi']> {
    return this.meta;
  }

  private _unique(arr: string[]) {
    return [...new Set(arr)];
  }
}

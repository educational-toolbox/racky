export abstract class MediaService {
  abstract get(fileKey: string): Promise<string>;
  abstract upload(fileId: string): Promise<{ url: string; key: string }>;
  abstract delete(fileKey: string): Promise<void>;
}

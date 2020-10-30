export class UniResponse {
  success: boolean;
  content: any;
  message: string;

  constructor(option: { success: boolean; content: any; message?: string }) {
    this.success = option.success;
    this.content = option.content || null;
    this.message = option.message || '';
  }

  toString() {
    return JSON.stringify(this);
  }
}

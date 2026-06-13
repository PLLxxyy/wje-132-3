import { apiPaths } from '../constants/apiPaths';
import { request, unwrap } from './request';

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return unwrap<{ url: string }>(
    request.post(apiPaths.uploads.image, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  );
}

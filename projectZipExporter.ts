import JSZip from 'jszip';

const sources = import.meta.glob(
  ['/index.html', '/package.json', '/metadata.json', '/tsconfig.json', '/vite.config.ts', '/README.md', '/src/**/*'],
  { query: '?raw', import: 'default', eager: true }
) as Record<string, string>;

export async function downloadProjectZip() {
  const zip = new JSZip();
  for (const [path, content] of Object.entries(sources)) {
    zip.file(path.replace(/^\//, ''), content);
  }
  const cover = await fetch('/images/cover.jpg');
  if (!cover.ok) throw new Error('표지 사진을 내려받지 못했습니다.');
  zip.file('public/images/cover.jpg', await cover.blob());
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'B-dessert-portfolio-source.zip';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

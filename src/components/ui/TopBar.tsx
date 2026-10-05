'use client';

import Link from 'next/link';
import { useSession } from '@/components/auth/SessionProvider';
import { Logo } from './Logo';

/**
 * Thanh trên cùng. Trên điện thoại chỗ rất hẹp nên:
 * - tên người dùng chỉ hiện chữ cái đầu, tên đầy đủ để dành cho màn rộng
 * - link quay lại và nút đăng xuất không được xuống dòng
 * - trạng thái lưu rút thành một chấm tròn, vẫn thấy được chứ không ẩn hẳn
 */
export function TopBar({ back, title }: { back?: { href: string; label: string }; title?: string }) {
  const { user, saving, savedAt, logout } = useSession();
  const name = user ? user.displayName || user.username : '';
  const savedLabel = saving ? 'Đang lưu…' : savedAt ? 'Đã lưu' : '';
  const savedTitle = savedAt ? `Lưu lúc ${new Date(savedAt).toLocaleString('vi-VN')}` : undefined;

  return (
    <header className="sticky top-0 z-20">
      <div aria-hidden className="absolute inset-0 -z-10 border-b border-slate-200 bg-white/90 backdrop-blur" />
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-3 py-1.5 sm:gap-3 sm:px-4 sm:py-2">
        {back ? (
          <Link href={back.href}
            className="-ml-1 shrink-0 whitespace-nowrap rounded-lg px-2 py-2.5 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900">
            <span aria-hidden>←</span> <span className="hidden sm:inline">{back.label}</span>
            <span className="sm:hidden">Quay lại</span>
          </Link>
        ) : (
          <Link href="/dashboard" aria-label="Trang chủ" className="-ml-1 shrink-0 rounded-lg p-1.5 hover:bg-slate-100"><Logo /></Link>
        )}

        <p className="min-w-0 flex-1 truncate font-semibold">{title}</p>

        {savedLabel && (
          <span title={savedTitle} className="shrink-0 text-xs text-slate-400">
            {/* Màn hẹp chỉ còn chấm tròn, chạm/di chuột vẫn xem được giờ lưu */}
            <span className="hidden whitespace-nowrap sm:inline">{savedLabel}</span>
            <span aria-label={savedLabel} className={`inline-block size-2 rounded-full sm:hidden ${saving ? 'bg-amber-400' : 'bg-emerald-500'}`} />
          </span>
        )}

        {user && (
          <>
            <span className="flex shrink-0 items-center gap-2 rounded-full bg-slate-100 p-1 sm:pr-3" title={name}>
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                {name[0]?.toUpperCase()}
              </span>
              <span className="hidden max-w-32 truncate text-sm font-medium sm:inline">{name}</span>
            </span>
            <button type="button" onClick={() => void logout()}
              className="shrink-0 whitespace-nowrap rounded-lg px-2 py-2.5 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900">
              Đăng xuất
            </button>
          </>
        )}
      </div>
    </header>
  );
}

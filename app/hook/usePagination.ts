'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useMemo } from 'react';

export function usePagination(defaultPage: number = 1) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = useMemo(() => {
    const page = searchParams.get('page');
    return page ? parseInt(page, 10) : defaultPage;
  }, [searchParams, defaultPage]);

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    
    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(url);
  };

  return { currentPage, setPage };
}
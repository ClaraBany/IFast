import { useInfiniteQuery } from "@tanstack/react-query";
import { getAll } from "./notificationService";
import RetryError from "@shared/components/RetryError";
import { PageHeader } from "@shared/components/navigation/PageHeader";
import { LoaderCircle } from "lucide-react";
import NotificationCard from "./NotificationCard";
import { useEffect, useRef } from "react";

export default function Notifications() {
  const { data, isLoading, isFetching, isFetchingNextPage, isError, hasNextPage, fetchNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ["notifications"],
      queryFn: ({ pageParam }) => getAll(pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => (lastPage.hasNext ? allPages.length : undefined),
    });

  const notifications = data?.pages.flatMap((page) => page.content) ?? [];

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError && !data) {
    return <RetryError onRetry={refetch} isFetching={isFetching} />;
  }

  return (
    <>
      <title>Notificações</title>
      <PageHeader title="Notificações" />

      {isLoading ? (
        <div className="flex-center flex-1">
          <LoaderCircle className="animate-spin text-primary" size={40} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2">
            {notifications.length === 0 ? (
              <p className="text-pretty text-neutral-dark md:col-span-2">Não encontramos nenhuma notificação.</p>
            ) : (
              notifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))
            )}
          </div>

          <div ref={sentinelRef} />

          {isFetchingNextPage && (
            <div className="flex-center py-5">
              <LoaderCircle className="animate-spin text-primary" size={28} />
            </div>
          )}

          {isError && data && (
            <button onClick={() => fetchNextPage()} className="btn btn-lg bg-primary">
              Tentar novamente
            </button>
          )}
        </>
      )}
    </>
  );
}

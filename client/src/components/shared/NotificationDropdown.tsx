import { useNotificationStore } from '@/store/notificationStore';
import { useNotificationPolling } from '@/hooks/useNotificationPolling';
import axiosInstance from '@/lib/axiosInstance';
import { Bell } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export function NotificationBell() {
  // Req 4.6 — starts/stops polling with auth lifecycle
  useNotificationPolling();

  const { unreadCount, notifications, markAllRead, markOneRead } = useNotificationStore();
  const [open, setOpen] = useState(false);

  // Req 4.9 — persist read-all to server then update local store
  const handleMarkAllRead = () => {
    axiosInstance.patch('/api/v1/notifications/read-all').catch(console.error);
    markAllRead();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {/* Req 4.8 — badge caps at 9+ */}
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-50 w-80 rounded-xl bg-white shadow-xl border border-gray-100">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="font-semibold text-sm text-charcoal">Notifications</span>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="text-xs text-gold-600 hover:underline">
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="p-4 text-center text-sm text-gray-400">No notifications</p>
              ) : (
                notifications.map((n) => (
                  // Req 4.7 — dim read notifications; Req 4.5 — mark one read on click
                  <Link
                    key={n._id}
                    to={n.link}
                    onClick={() => {
                      axiosInstance
                        .patch(`/api/v1/notifications/${n._id}/read`)
                        .catch(console.error);
                      markOneRead(n._id);
                      setOpen(false);
                    }}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b last:border-0 transition${n.isRead ? ' opacity-50' : ''}`}
                  >
                    <span className="mt-0.5 text-lg">{n.type === 'booking' ? '📅' : '✉️'}</span>
                    {/* Req 4.7 — title above message */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-charcoal">{n.title}</p>
                      <p className="text-sm text-charcoal">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {/* Req 4.10 — WhatsApp icon for booking notifications with link */}
                    {n.type === 'booking' && n.whatsappAlertLink && (
                      <a
                        href={n.whatsappAlertLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto shrink-0 text-lg"
                        onClick={(e) => e.stopPropagation()}
                      >
                        💬
                      </a>
                    )}
                  </Link>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import { Mail, MessageCircle, Phone } from "lucide-react";
import { AdminCard, AdminPageHeader, Flash } from "@/components/admin/ui";
import { markMessageReadAction } from "@/app/admin/actions";
import { getMessages } from "@/lib/db";
import { whatsappUrl } from "@/lib/utils";

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [messages, query] = await Promise.all([getMessages(), searchParams]);
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <AdminPageHeader
        eyebrow="Inbox"
        title="Messages"
        description="Enquiries submitted through the contact page."
        action={
          <div className="flex items-center gap-2 border border-navy/10 bg-white px-4 py-2">
            <span className="size-1.5 rounded-full bg-gold" />
            <span className="text-[0.62rem] font-bold uppercase tracking-[0.1em] text-navy/50">{unread} unread</span>
          </div>
        }
      />
      <div className="mt-5">
        <Flash saved={query.saved} />
      </div>

      {messages.length === 0 ? (
        <AdminCard>
          <div className="px-5 py-16 text-center">
            <p className="font-display text-xl text-navy">No messages yet.</p>
            <p className="mt-1 text-[0.72rem] text-navy/40">Messages from /contact will appear here.</p>
          </div>
        </AdminCard>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`border bg-white ${m.read ? "border-navy/10" : "border-gold/40"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-navy/8 px-5 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display text-lg leading-none text-navy">{m.name}</p>
                    {!m.read && <span className="bg-gold px-2 py-0.5 text-[0.48rem] font-bold uppercase tracking-[0.1em] text-navy">New</span>}
                  </div>
                  <p className="mt-1.5 text-[0.62rem] text-navy/35">
                    {m.subject} · {new Date(m.createdAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
                {!m.read && (
                  <form action={markMessageReadAction}>
                    <input type="hidden" name="id" value={m.id} />
                    <button type="submit" className="h-8 border border-navy/15 px-3 text-[0.55rem] font-bold uppercase tracking-[0.08em] text-navy/60 hover:border-navy">
                      Mark read
                    </button>
                  </form>
                )}
              </div>
              <p className="whitespace-pre-wrap px-5 py-4 text-[0.78rem] leading-relaxed text-navy/60">{m.message}</p>
              <div className="flex flex-wrap gap-3 border-t border-navy/8 bg-ivory/50 px-5 py-3">
                <a href={`tel:${m.phone}`} className="flex items-center gap-1.5 text-[0.66rem] text-navy/55 hover:text-gold-deep">
                  <Phone className="size-3" /> {m.phone}
                </a>
                <a href={`mailto:${m.email}`} className="flex items-center gap-1.5 text-[0.66rem] text-navy/55 hover:text-gold-deep">
                  <Mail className="size-3" /> {m.email}
                </a>
                <a
                  href={whatsappUrl(m.phone, `Hello ${m.name}, this is JJ Ebube Enterprise following up on your message.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-[0.66rem] font-semibold text-[#1FA855]"
                >
                  <MessageCircle className="size-3" /> Reply on WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

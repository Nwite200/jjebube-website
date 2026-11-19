import { AdminCard, AdminPageHeader, Flash, StatusBadge } from "@/components/admin/ui";
import { updateInquiryStatusAction } from "@/app/admin/actions";
import { getInquiries } from "@/lib/db";
import { whatsappUrl } from "@/lib/utils";
import { Mail, MessageCircle, Phone } from "lucide-react";

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const [inquiries, query] = await Promise.all([getInquiries(), searchParams]);
  const newCount = inquiries.filter((i) => i.status === "new").length;

  return (
    <div>
      <AdminPageHeader
        eyebrow="Wholesale desk"
        title="Bulk Enquiries"
        description="Quote requests submitted from the wholesale page. Update the status as you work through each one."
        action={
          <div className="flex items-center gap-2 border border-navy/10 bg-white px-4 py-2">
            <span className="size-1.5 rounded-full bg-gold" />
            <span className="text-[0.62rem] font-bold uppercase tracking-[0.1em] text-navy/50">
              {newCount} new
            </span>
          </div>
        }
      />
      <div className="mt-5">
        <Flash saved={query.saved} error={query.error} />
      </div>

      {inquiries.length === 0 ? (
        <AdminCard>
          <div className="px-5 py-16 text-center">
            <p className="font-display text-xl text-navy">No wholesale enquiries yet.</p>
            <p className="mt-1 text-[0.72rem] text-navy/40">Submissions from /wholesale will appear here.</p>
          </div>
        </AdminCard>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="border border-navy/10 bg-white">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-navy/8 px-5 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display text-lg leading-none text-navy">{inquiry.businessName || inquiry.fullName}</p>
                    <StatusBadge value={inquiry.status} />
                  </div>
                  <p className="mt-1.5 text-[0.6rem] text-navy/35">
                    {inquiry.id} · {new Date(inquiry.createdAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
                <form action={updateInquiryStatusAction} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={inquiry.id} />
                  <select name="status" defaultValue={inquiry.status} className="field h-8 w-auto text-[0.66rem]">
                    {["new", "contacted", "quoted", "closed"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button type="submit" className="h-8 bg-navy px-3 text-[0.55rem] font-bold uppercase tracking-[0.08em] text-ivory">
                    Save
                  </button>
                </form>
              </div>

              <div className="space-y-3 px-5 py-4 text-[0.72rem]">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[0.52rem] font-bold uppercase tracking-[0.1em] text-navy/35">Contact</p>
                    <p className="mt-1 font-medium text-navy">{inquiry.fullName}</p>
                    <a href={`tel:${inquiry.phone}`} className="mt-0.5 flex items-center gap-1.5 text-navy/55 hover:text-gold-deep">
                      <Phone className="size-3" /> {inquiry.phone}
                    </a>
                    {inquiry.email && (
                      <a href={`mailto:${inquiry.email}`} className="mt-0.5 flex items-center gap-1.5 break-all text-navy/55 hover:text-gold-deep">
                        <Mail className="size-3" /> {inquiry.email}
                      </a>
                    )}
                  </div>
                  <div>
                    <p className="text-[0.52rem] font-bold uppercase tracking-[0.1em] text-navy/35">Delivery</p>
                    <p className="mt-1 text-navy/60">{inquiry.location}</p>
                    {inquiry.quantity && <p className="mt-1 text-[0.65rem] text-navy/40">Quantity: {inquiry.quantity}</p>}
                  </div>
                </div>

                <div className="border-t border-navy/6 pt-3">
                  <p className="text-[0.52rem] font-bold uppercase tracking-[0.1em] text-navy/35">Products required</p>
                  <p className="mt-1 whitespace-pre-wrap leading-relaxed text-navy/60">{inquiry.products}</p>
                </div>

                {inquiry.details && (
                  <div className="border-t border-navy/6 pt-3">
                    <p className="text-[0.52rem] font-bold uppercase tracking-[0.1em] text-navy/35">Notes</p>
                    <p className="mt-1 whitespace-pre-wrap italic leading-relaxed text-navy/50">{inquiry.details}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 border-t border-navy/8 bg-ivory/50 px-5 py-3">
                <a
                  href={whatsappUrl(
                    inquiry.phone,
                    `Hello ${inquiry.fullName}, this is JJ Ebube Enterprise regarding your wholesale enquiry ${inquiry.id}.`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 items-center gap-1.5 bg-[#1FA855] px-3 text-[0.56rem] font-bold uppercase tracking-[0.08em] text-white"
                >
                  <MessageCircle className="size-3" /> WhatsApp
                </a>
                <a
                  href={`tel:${inquiry.phone}`}
                  className="inline-flex h-8 items-center gap-1.5 border border-navy/15 px-3 text-[0.56rem] font-bold uppercase tracking-[0.08em] text-navy"
                >
                  <Phone className="size-3" /> Call
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

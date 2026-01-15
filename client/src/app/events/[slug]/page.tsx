import type { EventProps } from "@/types";
import { ContentList } from "@/components/ContentList";
import { Card, type CardProps } from "@/components/Card";
import { getContentBySlug, getGlobalSettings } from "@/data/loaders";
import { notFound } from "next/navigation";
import { EventSignupForm } from "@/components/EventSignupForm";

async function loader(slug: string) {
  const { data } = await getContentBySlug(slug, "/api/events");
  const event = data[0];
  if (!event) throw notFound();
  return { event: event as EventProps, blocks: event?.blocks };
}

async function gloader() {
  const { data } = await getGlobalSettings();
  if (!data) throw new Error("Failed to fetch global settings");
  return { placeholder: data?.placeholder };
}

interface ParamsProps {
  params: Promise<{ slug: string }>
}

const EventCard = (props: Readonly<CardProps>) => (
  <Card {...props} basePath="events" />
);

export default async function SingleEventRoute({ params }: ParamsProps) {
  const slug = (await params).slug;
  const { event, blocks } = await loader(slug);
  const { placeholder } = await gloader();

  return (
    <div className="container">
      <div className="event-page">
        <EventSignupForm
          blocks={blocks}
          eventId={event.documentId ?? ""}
          startDate={event.startDate}
          price={event.price}
          image={{ url: event?.image?.url ?? placeholder.url, alt: event?.image?.alternativeText || "Event image" }}
        />
      </div>
      <ContentList
        headline="Featured Events"
        path="/api/events"
        component={EventCard}
        featured={true}
      />
    </div>
  );
}

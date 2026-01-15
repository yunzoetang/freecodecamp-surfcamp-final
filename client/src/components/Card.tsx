import { ImageProps } from "@/types";

import Link from "next/link";
import { StrapiImage } from "./StrapiImage";
import { formatDate } from "@/utils/format-date";
import { getGlobalSettings } from "@/data/loaders";

export interface CardProps {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  image?: ImageProps;
  price?: number;
  startDate?: string;
  createdAt: string;
  basePath: string;
}

async function loader() {
  const { data } = await getGlobalSettings();
  if (!data) throw new Error("Failed to fetch global settings");
  return { placeholder: data?.placeholder };
}

export async function Card({
  title,
  description,
  slug,
  image,
  price,
  createdAt,
  startDate,
  basePath,
}: Readonly<CardProps>) {
  const { placeholder } = await loader();
  return (
    <Link href={`/${basePath}/${slug}`} className="content-items__card">
      <div className="content-items__card-img">
        <StrapiImage
          src={image?.url || placeholder?.url }
          alt={image?.alternativeText || "No alternative text provided"}
          width={400}
          height={400}
        />
      </div>
      <div className="content-items__card-text">
        <h5>{title}</h5>
        {price && (
          <p>
            <span>Price: </span>
            {price}
          </p>
        )}
        {(startDate ?? createdAt) && (
          <p>{formatDate(startDate ?? createdAt)}</p>
        )}
        <p>{description.slice(0, 144)}...</p>
      </div>
    </Link>
  );
}
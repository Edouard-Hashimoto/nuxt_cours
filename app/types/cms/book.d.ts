import type { SanityDocument } from "@sanity/client";
import type { SanityImageSource } from "@sanity/image-url";

type SanityBook = SanityDocument & {
    title: string
    slug: string
    publishAt: string
    author: SanityAuthor
    cover : SanityImageSource
};
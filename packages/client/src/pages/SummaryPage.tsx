import { useState } from 'react';
import { Star, StarOff, RefreshCw, Ticket, Castle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import { useReviews } from '@/hooks/useReviews';
import { useSummary } from '@/hooks/useSummary';
import { useGenerateSummary } from '@/hooks/useGenerateSummary';
import { cn } from '@/lib/utils';

function StarRating({ rating }: { rating: number }) {
   return (
      <div className="flex items-center gap-0.5">
         {Array.from({ length: 5 }, (_, i) =>
            i < rating ? (
               <Star
                  key={i}
                  className="size-3.5 fill-violet-500 text-violet-500"
               />
            ) : (
               <StarOff key={i} className="size-3.5 text-muted-foreground" />
            )
         )}
      </div>
   );
}

function SkeletonCard() {
   return (
      <div className="animate-pulse rounded-2xl border border-border/60 bg-card p-5">
         <div className="mb-3 h-5 w-1/3 rounded bg-muted" />
         <div className="mb-2 h-3 w-full rounded bg-muted" />
         <div className="mb-1 h-3 w-full rounded bg-muted" />
         <div className="h-3 w-2/3 rounded bg-muted" />
      </div>
   );
}

function ProductCard({ productId }: { productId: number }) {
   const reviewsQuery = useReviews(productId);
   const summaryQuery = useSummary(productId);
   const generateMutation = useGenerateSummary(productId);

   return (
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
         <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <div className="flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-fuchsia-500 text-white">
                  <Ticket className="size-4" />
               </div>
               <h3 className="text-sm font-semibold">Product #{productId}</h3>
            </div>
            <Button
               size="sm"
               variant="outline"
               onClick={() => generateMutation.mutate(false)}
               disabled={generateMutation.isPending}
               className="gap-1.5"
            >
               {generateMutation.isPending ? (
                  <RefreshCw className="size-3.5 animate-spin" />
               ) : (
                  <RefreshCw className="size-3.5" />
               )}
               Generate Summary
            </Button>
         </div>

         {generateMutation.isError && (
            <div className="mb-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
               Failed to generate summary. Please try again.
            </div>
         )}

         {summaryQuery.isLoading ? (
            <div className="mb-4 animate-pulse rounded-xl border border-border/60 bg-muted/30 p-3">
               <div className="mb-2 h-3 w-1/4 rounded bg-muted" />
               <div className="mb-1 h-3 w-full rounded bg-muted" />
               <div className="h-3 w-2/3 rounded bg-muted" />
            </div>
         ) : summaryQuery.data ? (
            <div className="mb-4 rounded-xl border border-violet-500/20 bg-violet-500/5 p-3">
               <p className="mb-1 text-xs font-semibold text-violet-500">
                  AI Summary
               </p>
               <p className="text-sm leading-relaxed">
                  {summaryQuery.data.summary}
               </p>
            </div>
         ) : null}

         <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground">
               Reviews
            </p>
            {reviewsQuery.isLoading ? (
               <>
                  <SkeletonCard />
                  <SkeletonCard />
               </>
            ) : reviewsQuery.isError ? (
               <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  Failed to load reviews.
               </div>
            ) : reviewsQuery.data?.length === 0 ? (
               <p className="text-xs text-muted-foreground">No reviews yet.</p>
            ) : (
               reviewsQuery.data?.map((review) => (
                  <div
                     key={review.id}
                     className="rounded-xl border border-border/60 bg-muted/30 p-3"
                  >
                     <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-xs font-medium">
                           {review.author}
                        </span>
                        <StarRating rating={review.rating} />
                     </div>
                     <p className="text-xs leading-relaxed text-muted-foreground">
                        {review.content}
                     </p>
                  </div>
               ))
            )}
         </div>
      </div>
   );
}

export function SummaryPage() {
   const productsQuery = useProducts();
   const [selectedProductId, setSelectedProductId] = useState<number | null>(
      null
   );

   if (productsQuery.isLoading) {
      return (
         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
         </div>
      );
   }

   if (productsQuery.isError) {
      return (
         <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Failed to load products.
         </div>
      );
   }

   const products = productsQuery.data ?? [];

   return (
      <div className="space-y-6">
         <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25">
               <Castle className="size-5" />
            </div>
            <div>
               <h1 className="text-lg font-semibold tracking-tight">
                  Product Reviews
               </h1>
               <p className="text-xs text-muted-foreground">
                  Browse products, read reviews, and generate AI summaries
               </p>
            </div>
         </div>

         <div className="flex flex-wrap gap-2">
            {products.map((product) => (
               <button
                  key={product.id}
                  onClick={() => setSelectedProductId(product.id)}
                  className={cn(
                     'rounded-xl border px-4 py-2 text-sm font-medium transition-all',
                     selectedProductId === product.id
                        ? 'border-violet-500/40 bg-violet-500/10 text-violet-500 shadow-sm'
                        : 'border-border/60 bg-card text-muted-foreground hover:border-violet-500/30 hover:text-foreground'
                  )}
               >
                  {product.name}
               </button>
            ))}
         </div>

         {selectedProductId !== null ? (
            <ProductCard productId={selectedProductId} />
         ) : (
            <p className="text-sm text-muted-foreground">
               Select a product to view its reviews and summary.
            </p>
         )}
      </div>
   );
}

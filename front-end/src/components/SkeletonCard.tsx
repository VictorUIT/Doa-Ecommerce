import { Card, CardContent, Skeleton } from "@mui/material";

function ProductSkeleton() {
  return (
    <Card>
      <Skeleton variant="rectangular" height={200} />

      <CardContent>
        <Skeleton height={30} />
        <Skeleton width="60%" />
      </CardContent>
    </Card>
  );
}

export default ProductSkeleton;

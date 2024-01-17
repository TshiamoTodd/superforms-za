import { CreateForm, GetFormStats, GetForms } from "@/actions/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

import { Separator } from "@/components/ui/separator";
import CardsStatsWrapper from "@/components/stats/cards-stats-wrapper";
import StatsCards from "@/components/stats/stats-cards";
import { Form } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { LuView } from "react-icons/lu";
import { FaEdit, FaWpforms } from "react-icons/fa";
import { BiRightArrowAlt } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CreateFormDialog from "@/components/create-form-dialog";

const Home = () => {
  return (
    <div className="container pt-4">
      <Suspense fallback={<StatsCards loading={true}/>}>
        <CardsStatsWrapper />
      </Suspense>
      <Separator className="my-6" />
      <h2 className="text-4xl font-bold col-span-2 pb-2">Your forms</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateFormDialog/>
        <Suspense fallback={[1,2,3,4,5].map(el => (
          <FormCardSkeleton key={el}/>
        ))}>
          <FormCards/>
        </Suspense>
      </div>
      <Separator className="my-6" />
    </div>
  )
}

const FormCardSkeleton = () => {
  return (
    <Skeleton className="border-2 border-primary-/20 h-[190px] w-full" />
  )
};

const FormCards = async() => {
  const forms = await GetForms();

  return (
    <>
      {forms.map(form => (
        <FormCard
          key={form.id}
          form={form}
        />
      ))}
    </>
  );
  
}

const FormCard = ({form}: {form: Form}) => {
  return (
    <Card className="border-2 border-primary-/20 h-[190px] w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="truncate font-bold">
            {form.name}
          </span>
          {form.published && <Badge>Published</Badge>}
          {!form.published && <Badge variant={'destructive'}>Draft</Badge>}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {formatDistance(form.createdAt, new Date(), { addSuffix: true })}
          {
            form.published && <span className="flex items-center gap-2">
              <LuView className="text-muted-foreground"/>
              <span>
                {form.visits.toLocaleString()}
              </span>
              <FaWpforms className="text-muted-foreground"/>
              <span>
                {form.visits.toLocaleString()}
              </span>
            </span>
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
          {form.description || 'No description'}
      </CardContent>
      <CardFooter>
        {form.published && (
          <Button asChild className="w-full mt-2 text-md gap-4">
            <Link href={`/forms/${form.id}`}>
              View submissions <BiRightArrowAlt/>
            </Link>
          </Button>
        )}
        {!form.published && (
          <Button 
            asChild
            variant={'secondary'} 
            className="w-full mt-2 text-md gap-4"
          >
            <Link href={`/builder/${form.id}`}>
              Edit form <FaEdit/>
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default Home;

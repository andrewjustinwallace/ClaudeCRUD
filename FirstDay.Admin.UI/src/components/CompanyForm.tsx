import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Company } from "@/types";

const companyFormSchema = z.object({
  companyId: z.number().optional(),
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  isActive: z.boolean().default(true),
});

type CompanyFormData = z.infer<typeof companyFormSchema>;

interface CompanyFormProps {
  initialData?: Partial<Company>;
  onSubmit: (data: CompanyFormData) => Promise<void>;
  onCancel: () => void;
}

export function CompanyForm({
  initialData,
  onSubmit,
  onCancel
}: CompanyFormProps) {
  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      companyId: initialData?.companyId,
      companyName: initialData?.companyName || "",
      isActive: initialData?.isActive ?? true,
    },
  });

  async function handleSubmit(data: CompanyFormData) {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error("Error submitting company form:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter company name" {...field} />
              </FormControl>
              <FormDescription>
                The official name of the company.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <FormDescription>
                  Determines if this company is active in the system.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={!form.formState.isDirty}
          >
            {initialData?.companyId ? "Update" : "Create"} Company
          </Button>
        </div>
      </form>
    </Form>
  );
}
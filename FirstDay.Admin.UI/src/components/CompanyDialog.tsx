import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Company } from "@/types";
import { CompanyForm } from "./CompanyForm";

interface CompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company?: Company;
  onSubmit: (data: Partial<Company>) => Promise<void>;
}

export function CompanyDialog({
  open,
  onOpenChange,
  company,
  onSubmit
}: CompanyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>
            {company ? "Edit Company" : "Add New Company"}
          </DialogTitle>
          <DialogDescription>
            {company 
              ? "Update the company details below." 
              : "Fill in the details to create a new company."}
          </DialogDescription>
        </DialogHeader>
        <CompanyForm
          initialData={company}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
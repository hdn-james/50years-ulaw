"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const fieldVariants = cva(
  "group/field relative isolate flex w-full data-[orientation=vertical]:flex-col data-[orientation=horizontal]:items-start data-[orientation=responsive]:flex-col data-[orientation=responsive]:@lg/field-group:flex-row data-[orientation=responsive]:@lg/field-group:items-start",
  {
    variants: {
      orientation: {
        vertical: "",
        horizontal: "flex-row items-start",
        responsive: "",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  },
);

const Field = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof fieldVariants> & {
      orientation?: "vertical" | "horizontal" | "responsive";
    }
>(({ className, orientation = "vertical", ...props }, ref) => (
  <div
    ref={ref}
    data-orientation={orientation}
    className={cn(
      fieldVariants({ orientation }),
      "gap-2 data-[orientation=horizontal]:gap-4 data-[orientation=responsive]:@lg/field-group:gap-6",
      className,
    )}
    {...props}
  />
));
Field.displayName = "Field";

const FieldSet = React.forwardRef<HTMLFieldSetElement, React.FieldsetHTMLAttributes<HTMLFieldSetElement>>(
  ({ className, ...props }, ref) => (
    <fieldset ref={ref} className={cn("space-y-6 border-0 p-0", className)} {...props} />
  ),
);
FieldSet.displayName = "FieldSet";

const fieldLegendVariants = cva("font-semibold tracking-tight text-foreground", {
  variants: {
    variant: {
      legend: "text-base",
      label: "text-sm font-medium",
    },
  },
  defaultVariants: {
    variant: "legend",
  },
});

const FieldLegend = React.forwardRef<
  HTMLLegendElement,
  React.HTMLAttributes<HTMLLegendElement> & VariantProps<typeof fieldLegendVariants>
>(({ className, variant, ...props }, ref) => (
  <legend ref={ref} className={cn(fieldLegendVariants({ variant }), className)} {...props} />
));
FieldLegend.displayName = "FieldLegend";

const FieldGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("@container/field-group flex flex-col gap-6", className)} {...props} />
  ),
);
FieldGroup.displayName = "FieldGroup";

const FieldContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-2 group-data-[orientation=horizontal]/field:justify-center group-data-[orientation=responsive]/field:@lg/field-group:justify-center",
        className,
      )}
      {...props}
    />
  ),
);
FieldContent.displayName = "FieldContent";

const FieldLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & {
    asChild?: boolean;
  }
>(({ className, asChild, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "label";

  if (asChild) {
    return <>{props.children}</>;
  }

  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
});
FieldLabel.displayName = "FieldLabel";

const FieldTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm font-medium leading-none text-foreground", className)} {...props} />
  ),
);
FieldTitle.displayName = "FieldTitle";

const FieldDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        "text-sm text-muted-foreground",
        "group-data-[orientation=horizontal]/field:max-w-[50ch] group-data-[orientation=responsive]/field:@lg/field-group:max-w-[50ch]",
        className,
      )}
      {...props}
    />
  ),
);
FieldDescription.displayName = "FieldDescription";

const FieldSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      className={cn(
        "relative flex items-center gap-4 py-2 text-sm text-muted-foreground",
        children &&
          "before:flex-1 before:border-t before:border-border after:flex-1 after:border-t after:border-border",
        !children && "border-t border-border",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
FieldSeparator.displayName = "FieldSeparator";

const FieldError = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    errors?: Array<{ message?: string } | undefined>;
  }
>(({ className, errors, children, ...props }, ref) => {
  const errorMessages = errors
    ?.filter((error): error is { message: string } => !!error?.message)
    .map((error) => error.message);

  const body = errorMessages && errorMessages.length > 0 ? errorMessages : children;

  if (!body || (Array.isArray(body) && body.length === 0)) {
    return null;
  }

  const messages = Array.isArray(body) ? body : [body];

  return (
    <div ref={ref} {...props}>
      {messages.length > 1 ? (
        <ul className={cn("list-inside list-disc space-y-1 text-sm font-medium text-destructive", className)}>
          {messages.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      ) : (
        <p className={cn("text-sm font-medium text-destructive", className)}>{messages[0]}</p>
      )}
    </div>
  );
});
FieldError.displayName = "FieldError";

export {
  Field,
  FieldSet,
  FieldLegend,
  FieldGroup,
  FieldContent,
  FieldLabel,
  FieldTitle,
  FieldDescription,
  FieldSeparator,
  FieldError,
};

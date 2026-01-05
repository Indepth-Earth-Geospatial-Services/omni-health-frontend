"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FeedbackData, feedbackSchema } from "../schemas/feedback.schema";

function FeedbackForm() {
  const form = useForm<FeedbackData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      email: "",
      name: "",
      message: "",
      messageType: "general feedback",
    },
  });
  function onSubmit(data: FeedbackData) {
    toast.success("message sent successfully");
    console.log(data);
  }
  return (
    <div className="mt-4 h-full w-full font-normal">
      <h2 className="mb-4 text-[19px] font-normal">Contact and Feedback</h2>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="gap-4">
          {/*  NAME */}
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel
                  className="text-xs font-normal text-[#0A0D14]"
                  htmlFor={field.name}
                >
                  Your Name
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your name"
                  className="h-12 rounded-xl border border-[#E2E4E9] bg-[#F6F8FA]"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/*EMAIL */}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel
                  className="text-xs font-normal text-[#0A0D14]"
                  htmlFor={field.name}
                >
                  Email Address
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="youremail@gmail.com"
                  className="h-12 rounded-xl border border-[#E2E4E9] bg-[#F6F8FA]"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* MESSAGE */}
          <Controller
            name="message"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel
                  className="text-xs font-normal text-[#0A0D14]"
                  htmlFor={field.name}
                >
                  Your Message
                </FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  className="h-25.75 rounded-xl border border-[#E2E4E9] bg-[#F6F8FA]"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* MESSAGE TYPE */}
          <Controller
            name="messageType"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel
                  className="text-xs font-normal text-[#0A0D14]"
                  htmlFor={field.name}
                >
                  Message Type
                </FieldLabel>
                <Select
                  {...field}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    className="h-25.75 rounded-xl border border-[#E2E4E9] bg-[#F6F8FA]"
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general feedback">
                      General Feedback
                    </SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <div className="mt-6 flex w-full justify-center">
          <Button className="bg-primary h-12 grow rounded-full">
            <Send size={20} /> Send Message
          </Button>
        </div>
      </form>
    </div>
  );
}

export default FeedbackForm;

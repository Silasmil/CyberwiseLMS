import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Shield, Upload, CheckCircle2, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertApplicationSchema, type InsertApplication } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Apply() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<InsertApplication>({
    resolver: zodResolver(insertApplicationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      experienceLevel: "beginner",
      reason: "",
      cvUrl: "",
    },
  });

  const applyMutation = useMutation({
    mutationFn: async (data: InsertApplication) => {
      return await apiRequest("POST", "/api/applications", data);
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "You'll receive a confirmation email shortly. We'll review your application within 2-3 business days.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message,
      });
    },
  });

  function onSubmit(values: InsertApplication) {
    applyMutation.mutate(values);
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/20 to-background">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Application Received!</CardTitle>
            <CardDescription>
              Thank you for applying to Cyberwise Ethical Hacking Bootcamp
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              We've received your application and sent a confirmation email to <strong>{form.getValues("email")}</strong>. 
              Our admissions team will review it within 2-3 business days.
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Once approved, you'll receive your admission number and login credentials.
            </p>
            <div className="pt-4 space-y-2">
              <Button className="w-full" onClick={() => navigate("/")} data-testid="button-back-home">
                Back to Home
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate("/login")} data-testid="button-go-login">
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="link-back-home">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="font-heading text-3xl md:text-4xl font-bold">Apply for Access</h1>
            </div>
            <p className="text-muted-foreground">
              Complete the application form to request access to Cyberwise Ethical Hacking Bootcamp
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Application Form</CardTitle>
              <CardDescription>
                All fields are required unless marked optional. Please ensure your information is accurate.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} data-testid="input-fullname" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} data-testid="input-email" />
                        </FormControl>
                        <FormDescription>
                          You'll receive your admission credentials at this email
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+254 712 345 678" {...field} data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Nairobi, Kenya" {...field} data-testid="input-location" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experienceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-experience">
                              <SelectValue placeholder="Select your experience level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner - New to cybersecurity</SelectItem>
                            <SelectItem value="intermediate">Intermediate - Some IT/networking experience</SelectItem>
                            <SelectItem value="advanced">Advanced - Professional experience in IT/security</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Why do you want to join?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your goals and why you're interested in ethical hacking..."
                            className="min-h-32 resize-none"
                            {...field}
                            data-testid="input-reason"
                          />
                        </FormControl>
                        <FormDescription>
                          Share your motivation and career goals (minimum 50 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cvUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CV/Resume URL (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/my-cv.pdf"
                            {...field}
                            data-testid="input-cv-url"
                          />
                        </FormControl>
                        <FormDescription>
                          Link to your CV or LinkedIn profile (optional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4 space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-2">Data Protection Notice</p>
                      <p>
                        By submitting this application, you consent to the collection and processing of your personal data 
                        in accordance with GDPR and Kenya Data Protection Act. Your information will only be used for 
                        admission purposes and course administration.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={applyMutation.isPending}
                      data-testid="button-submit-application"
                    >
                      {applyMutation.isPending ? "Submitting..." : "Submit Application"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

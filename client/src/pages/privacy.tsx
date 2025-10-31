import { Link } from "wouter";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="font-heading text-3xl md:text-4xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Introduction</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>
                Cyberwise Ethical Hacking Bootcamp ("we", "our", or "us") is committed to protecting your personal information 
                and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                in compliance with the General Data Protection Regulation (GDPR) and the Kenya Data Protection Act, 2019.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>We collect personal information that you voluntarily provide when you:</p>
              <ul>
                <li>Apply for access to our bootcamp</li>
                <li>Register as a student</li>
                <li>Submit assignments or participate in discussions</li>
                <li>Contact us for support</li>
              </ul>
              <p className="mt-4">The personal information we collect includes:</p>
              <ul>
                <li><strong>Contact Information:</strong> Full name, email address, phone number, location</li>
                <li><strong>Application Data:</strong> Experience level, motivation for joining, CV/resume (optional)</li>
                <li><strong>Account Data:</strong> Admission number, password (encrypted), login history</li>
                <li><strong>Academic Data:</strong> Course enrollment, module progress, assignment submissions, grades, certificates</li>
                <li><strong>Communication Data:</strong> Discussion posts, replies, support inquiries</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>We use your personal information for the following purposes:</p>
              <ul>
                <li><strong>Application Processing:</strong> To review and process your bootcamp application</li>
                <li><strong>Account Management:</strong> To create and manage your student account</li>
                <li><strong>Course Delivery:</strong> To provide access to learning materials, track progress, and manage certifications</li>
                <li><strong>Communication:</strong> To send admission notifications, course updates, and assignment feedback</li>
                <li><strong>Support:</strong> To respond to inquiries and provide technical assistance</li>
                <li><strong>Analytics:</strong> To improve our educational services and platform functionality</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legal Basis for Processing</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>Under GDPR and Kenya Data Protection Act, we process your personal data based on:</p>
              <ul>
                <li><strong>Consent:</strong> You have given explicit consent for specific processing activities</li>
                <li><strong>Contract Performance:</strong> Processing is necessary to fulfill our educational services contract with you</li>
                <li><strong>Legitimate Interests:</strong> Processing is necessary for our legitimate interests in providing quality education while respecting your rights</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Sharing and Disclosure</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>We do not sell your personal information. We may share your data with:</p>
              <ul>
                <li><strong>Cisco NetAcad:</strong> When you access NetAcad course materials, you're subject to their terms and privacy policy</li>
                <li><strong>Service Providers:</strong> Third-party services that help us operate our platform (hosting, email delivery)</li>
                <li><strong>Legal Obligations:</strong> When required by law or to protect rights and safety</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>Under GDPR and Kenya Data Protection Act, you have the right to:</p>
              <ul>
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong>Erasure:</strong> Request deletion of your personal data (subject to legal retention requirements)</li>
                <li><strong>Restriction:</strong> Request limitation of processing under certain circumstances</li>
                <li><strong>Data Portability:</strong> Receive your data in a structured, commonly used format</li>
                <li><strong>Object:</strong> Object to processing of your personal data</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent at any time (where processing is based on consent)</li>
              </ul>
              <p className="mt-4">To exercise these rights, contact us at miltonsilas564@gmail.com</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>We implement appropriate technical and organizational measures to protect your personal data, including:</p>
              <ul>
                <li>Encryption of sensitive data (passwords, personal information)</li>
                <li>Secure HTTPS connections for all data transmission</li>
                <li>Access controls and authentication requirements</li>
                <li>Regular security assessments and updates</li>
                <li>Staff training on data protection practices</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>We retain your personal data for as long as necessary to:</p>
              <ul>
                <li>Provide our educational services</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce agreements</li>
              </ul>
              <p className="mt-4">Academic records (grades, certificates) may be retained indefinitely for verification purposes. You may request deletion of other data at any time, subject to legal requirements.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>We use essential cookies to:</p>
              <ul>
                <li>Maintain your login session</li>
                <li>Remember your preferences (theme, language)</li>
                <li>Ensure platform security</li>
              </ul>
              <p className="mt-4">We do not use third-party advertising or tracking cookies.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>If you have questions about this Privacy Policy or wish to exercise your data protection rights, contact:</p>
              <ul>
                <li><strong>Email:</strong> miltonsilas564@gmail.com</li>
                <li><strong>Phone/WhatsApp:</strong> +254 713 121 435</li>
                <li><strong>Data Protection Officer:</strong> Milton Silas</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new 
                policy on this page and updating the "Last updated" date. Your continued use of our services after changes constitutes 
                acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

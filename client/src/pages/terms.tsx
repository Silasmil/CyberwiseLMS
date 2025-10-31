import { Link } from "wouter";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
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
            <h1 className="font-heading text-3xl md:text-4xl font-bold">Terms & Conditions</h1>
          </div>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agreement to Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>
                By accessing and using the Cyberwise Ethical Hacking Bootcamp learning management system ("Platform"), 
                you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, 
                you may not access the Platform.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admission and Access</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <ul>
                <li>All students must apply for access and be approved by the administrator before accessing course content</li>
                <li>Upon approval, you will receive a unique admission number and initial password</li>
                <li>You are required to change your password on first login for security purposes</li>
                <li>Your admission number and password are personal and must not be shared with others</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>We reserve the right to refuse admission or revoke access at our discretion</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Code of Conduct</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>As a student of Cyberwise Ethical Hacking Bootcamp, you agree to:</p>
              <ul>
                <li>Use all knowledge and skills gained solely for ethical and legal purposes</li>
                <li>Never engage in unauthorized hacking, data breaches, or illegal activities</li>
                <li>Respect intellectual property rights and course materials</li>
                <li>Participate respectfully in discussions and communications</li>
                <li>Submit original work for assignments unless collaboration is explicitly permitted</li>
                <li>Not share course materials with unauthorized individuals</li>
                <li>Report any security vulnerabilities discovered during training to instructors</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Completion and Certification</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <ul>
                <li>Certificates are awarded upon achieving minimum 80% course completion and passing the capstone project</li>
                <li>You must complete assignments by their due dates to maintain good standing</li>
                <li>Module access is scheduled and controlled by release dates</li>
                <li>Extensions for assignments may be granted at instructor discretion</li>
                <li>Certificates are digital and downloadable from your student dashboard</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <ul>
                <li>All course materials, videos, documents, and content remain the property of Cyberwise Ethical Hacking Bootcamp and/or Cisco NetAcad</li>
                <li>You may not reproduce, distribute, or create derivative works from course materials without permission</li>
                <li>Your assignments and project submissions remain your intellectual property, but you grant us a license to use them for educational purposes</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment and Refunds</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <ul>
                <li>Payment processing is handled externally and is separate from this Platform</li>
                <li>Access to course content requires payment verification by the administrator</li>
                <li>Refund policies are determined on a case-by-case basis</li>
                <li>Contact miltonsilas564@gmail.com for payment-related inquiries</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>
                The Platform and course materials are provided "as is" without warranties of any kind. We are not liable for:
              </p>
              <ul>
                <li>Any misuse of knowledge or skills gained through the bootcamp</li>
                <li>Technical issues, downtime, or data loss</li>
                <li>Third-party services (such as Cisco NetAcad) that you access through our Platform</li>
                <li>Indirect, incidental, or consequential damages arising from use of the Platform</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>We reserve the right to terminate or suspend access to the Platform immediately, without prior notice, for:</p>
              <ul>
                <li>Violation of these Terms and Conditions</li>
                <li>Unethical or illegal use of acquired knowledge</li>
                <li>Academic dishonesty or plagiarism</li>
                <li>Harassment or abusive behavior toward instructors or students</li>
                <li>Non-payment of fees</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modifications to Service</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>
                We reserve the right to modify or discontinue the Platform or any course content at any time without notice. 
                We will not be liable if any part of the Platform is unavailable at any time.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of Kenya. 
                Any disputes arising from these Terms or use of the Platform shall be subject to the exclusive jurisdiction of Kenyan courts.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>For questions about these Terms and Conditions, please contact:</p>
              <ul>
                <li><strong>Email:</strong> miltonsilas564@gmail.com</li>
                <li><strong>Phone/WhatsApp:</strong> +254 713 121 435</li>
                <li><strong>Instructor:</strong> Milton Silas - Cisco Trainer / Cybersecurity Specialist</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>
                We reserve the right to update these Terms and Conditions at any time. We will notify students of material changes 
                via email and/or platform announcements. Your continued use of the Platform after changes constitutes acceptance of the updated terms.
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

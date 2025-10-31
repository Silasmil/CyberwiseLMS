import { Link } from "wouter";
import { Shield, Lock, Network, Award, Mail, Phone, ChevronDown, BookOpen, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-heading font-bold text-xl">Cyberwise</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#courses" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Courses
            </a>
            <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </a>
            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
            <Link href="/login">
              <Button variant="ghost" size="sm" data-testid="link-login">
                Login
              </Button>
            </Link>
            <Link href="/apply">
              <Button size="sm" data-testid="link-apply">
                Apply for Access
              </Button>
            </Link>
            <ThemeToggle />
          </nav>
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Link href="/apply">
              <Button size="sm" data-testid="link-apply-mobile">
                Apply
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden py-24 md:py-32 lg:py-40">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="container relative z-10">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Cyberwise Ethical Hacking Bootcamp
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Master cybersecurity through hands-on ethical hacking training with expert instructors and industry-recognized certifications
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/apply">
                  <Button size="lg" className="text-base px-8" data-testid="button-hero-apply">
                    Apply for Access
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-base px-8" data-testid="button-hero-courses" asChild>
                  <a href="#courses">View Course Outline</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="courses" className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Course Overview</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive cybersecurity training covering ethical hacking, penetration testing, and network security
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    What You'll Learn
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <p className="text-sm text-foreground">Network security and vulnerability assessment</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <p className="text-sm text-foreground">Penetration testing methodologies and tools</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <p className="text-sm text-foreground">Web application security and exploitation</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <p className="text-sm text-foreground">Wireless network security and attacks</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <p className="text-sm text-foreground">Social engineering and physical security</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Certification & Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <p className="text-sm text-foreground">Industry-recognized certification upon completion</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <p className="text-sm text-foreground">Hands-on lab experience with real-world scenarios</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <p className="text-sm text-foreground">Expert instruction from Cisco-certified trainers</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <p className="text-sm text-foreground">Access to comprehensive learning materials</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <p className="text-sm text-foreground">Career advancement opportunities in cybersecurity</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 max-w-3xl mx-auto">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>NetAcad Resources</CardTitle>
                  <CardDescription>Access Cisco NetAcad courses and lab materials</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" className="flex-1 gap-2" data-testid="link-netacad-course" asChild>
                    <a href="https://www.netacad.com/courses/cybersecurity/ethical-hacker" target="_blank" rel="noopener noreferrer">
                      <BookOpen className="h-4 w-4" />
                      Ethical Hacker Course
                    </a>
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2" data-testid="link-netacad-labs" asChild>
                    <a href="https://www.netacad.com" target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" />
                      Lab Downloads
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="faq" className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">Everything you need to know about the bootcamp</p>
            </div>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">What are the prerequisites for this course?</AccordionTrigger>
                  <AccordionContent>
                    Basic understanding of networking concepts and computer systems is recommended. Familiarity with Linux command line is helpful but not required. We welcome students from beginner to advanced levels.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">How long does the bootcamp take to complete?</AccordionTrigger>
                  <AccordionContent>
                    The bootcamp is self-paced with structured modules released on a schedule. Most students complete the program in 3-6 months, depending on their availability and prior experience. Each module includes video lessons, readings, and hands-on lab exercises.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">What certification will I receive?</AccordionTrigger>
                  <AccordionContent>
                    Upon successful completion of the bootcamp (80% completion rate and capstone project), you'll receive a Cyberwise Ethical Hacking Bootcamp completion certificate. Additionally, the course prepares you for industry certifications like CEH (Certified Ethical Hacker).
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">How does the approval process work?</AccordionTrigger>
                  <AccordionContent>
                    After submitting your application, our admissions team reviews it within 2-3 business days. Once approved, you'll receive your unique admission number and login credentials via email. You must be approved before accessing any course content.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">Are there live sessions or is it fully online?</AccordionTrigger>
                  <AccordionContent>
                    The bootcamp is primarily self-paced online learning with pre-recorded videos and interactive labs. However, we offer optional live Q&A sessions with instructors and a discussion forum where you can ask questions and collaborate with peers.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
              <p className="text-lg text-muted-foreground">Have questions? Contact our team</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Reach out to our admissions team</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Email</p>
                      <a href="mailto:miltonsilas564@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        miltonsilas564@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">WhatsApp / Phone</p>
                      <a href="tel:+254713121435" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        +254 713 121 435
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Network className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Instructor</p>
                      <p className="text-sm text-muted-foreground">
                        Milton Silas - Cisco Trainer / Cybersecurity Specialist
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ready to Start?</CardTitle>
                  <CardDescription>Apply now to begin your cybersecurity journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-6">
                    Submit your application today and join hundreds of students learning cutting-edge cybersecurity skills. Our admissions team will review your application and get back to you within 2-3 business days.
                  </p>
                  <Link href="/apply">
                    <Button className="w-full" size="lg" data-testid="button-contact-apply">
                      Submit Application
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-heading font-bold text-xl">Cyberwise</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional ethical hacking and cybersecurity training for aspiring security professionals.
              </p>
            </div>
            <div>
              <h3 className="font-heading font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#courses" className="hover:text-primary transition-colors">Courses</a></li>
                <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><Link href="/apply" className="hover:text-primary transition-colors">Apply</Link></li>
                <li><Link href="/login" className="hover:text-primary transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Cyberwise Ethical Hacking Bootcamp. All rights reserved.</p>
            <p className="mt-2">We are committed to protecting your personal data in compliance with GDPR and Kenya Data Protection Act.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

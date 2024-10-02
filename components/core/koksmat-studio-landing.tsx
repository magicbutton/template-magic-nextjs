import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChefHat,
  Code,
  Shield,
  Zap,
  FileCode,
  Database,
  Lock,
  LucideIcon,
} from "lucide-react";
import { href } from "./rootlayout";
import Link from "next/link";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <Card className="flex flex-col items-center text-center">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        {icon}
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
};

const features: FeatureCardProps[] = [
  {
    icon: <FileCode className="h-8 w-8 text-primary" />,
    title: "Organize with Ease",
    description:
      "Streamline your coding process with our rich set of templates. Structure your projects efficiently and say goodbye to cluttered codebases.",
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "AI at Your Fingertips",
    description:
      "Seamlessly integrate AI into your daily work with intelligent prompt suggestions based on your specific context.",
  },
  {
    icon: <Database className="h-8 w-8 text-primary" />,
    title: "Data Flow Described",
    description:
      "Visualize and document your data processes with clear and comprehensive data flow descriptions, ensuring regulatory compliance.",
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Construct Secure Data Pipelines",
    description:
      "Build and manage data pipelines designed to filter and secure your information, ensuring data reaches the right hands.",
  },
  {
    icon: <Lock className="h-8 w-8 text-primary" />,
    title: "Zero Trust Security Models",
    description:
      "Implement cutting-edge security models with ease, giving you full control over who accesses your data.",
  },
  {
    icon: <ChefHat className="h-8 w-8 text-primary" />,
    title: "Your Digital Kitchen",
    description:
      "Access all the artifacts you need to prepare your next digital masterpiece in one convenient portal.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <header className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100">
          Welcome to Magic Button Studio
        </h1>
        <p className="text-xl text-center mt-4 text-gray-600 dark:text-gray-300">
          Crafting Your Code, Securing Your Data, Elevating Your AI
        </p>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </section>

        <section className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Ready to cook up your next big project?
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Explore Magic Button Studio today and elevate your digital craftsmanship.
          </p>
          <Link href={href.ROLE}>
            <Button className="mt-8 text-lg" size="lg">
              Get Started
            </Button>
          </Link>
        </section>
      </main>
    </div>
  );
}

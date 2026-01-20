import { PrismaClient, Role, ApplicationStatus, EnrollmentStatus } from "@/generated/prisma";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create users with different roles
  const hashedPassword = await hash("Password123!", 10);

  // 1. Create Principal
  const principal = await prisma.user.upsert({
    where: { email: "principal@mimodaycare.com" },
    update: {},
    create: {
      email: "principal@mimodaycare.com",
      password: hashedPassword,
      name: "Dr. Sarah Johnson",
      roles: [Role.PRINCIPAL, Role.ADMIN, Role.EXECUTIVE],
    },
  });
  console.log("✅ Created Principal:", principal.email);

  // 2. Create Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@mimodaycare.com" },
    update: {},
    create: {
      email: "admin@mimodaycare.com",
      password: hashedPassword,
      name: "Michael Chen",
      roles: [Role.ADMIN],
    },
  });
  console.log("✅ Created Admin:", admin.email);

  // 3. Create Executive
  const executive = await prisma.user.upsert({
    where: { email: "executive@mimodaycare.com" },
    update: {},
    create: {
      email: "executive@mimodaycare.com",
      password: hashedPassword,
      name: "Jennifer Martinez",
      roles: [Role.EXECUTIVE],
    },
  });
  console.log("✅ Created Executive:", executive.email);

  // 4. Create Teachers
  const teacher1 = await prisma.user.upsert({
    where: { email: "teacher1@mimodaycare.com" },
    update: {},
    create: {
      email: "teacher1@mimodaycare.com",
      password: hashedPassword,
      name: "Emily Thompson",
      roles: [Role.TEACHER],
    },
  });

  const teacher2 = await prisma.user.upsert({
    where: { email: "teacher2@mimodaycare.com" },
    update: {},
    create: {
      email: "teacher2@mimodaycare.com",
      password: hashedPassword,
      name: "David Rodriguez",
      roles: [Role.TEACHER],
    },
  });
  console.log("✅ Created Teachers:", teacher1.email, teacher2.email);

  // 5. Create Parents
  const parent1 = await prisma.user.upsert({
    where: { email: "parent1@example.com" },
    update: {},
    create: {
      email: "parent1@example.com",
      password: hashedPassword,
      name: "John Smith",
      roles: [Role.PARENT],
    },
  });

  const parent2 = await prisma.user.upsert({
    where: { email: "parent2@example.com" },
    update: {},
    create: {
      email: "parent2@example.com",
      password: hashedPassword,
      name: "Maria Garcia",
      roles: [Role.PARENT],
    },
  });

  const parent3 = await prisma.user.upsert({
    where: { email: "parent3@example.com" },
    update: {},
    create: {
      email: "parent3@example.com",
      password: hashedPassword,
      name: "James Wilson",
      roles: [Role.PARENT],
    },
  });
  console.log("✅ Created Parents:", parent1.email, parent2.email, parent3.email);

  // 6. Create Programs
  const infantProgram = await prisma.program.upsert({
    where: { name: "Infant Care" },
    update: {},
    create: {
      name: "Infant Care",
      description: "Loving care and early development for infants 6 weeks to 12 months",
      ageRange: "6 weeks - 12 months",
      capacity: 12,
      tuitionFee: 1500.00,
      schedule: "Monday - Friday, 6:30 AM - 6:00 PM",
    },
  });

  const toddlerProgram = await prisma.program.upsert({
    where: { name: "Toddler Program" },
    update: {},
    create: {
      name: "Toddler Program",
      description: "Active learning and exploration for children 1-2 years",
      ageRange: "1 - 2 years",
      capacity: 15,
      tuitionFee: 1300.00,
      schedule: "Monday - Friday, 6:30 AM - 6:00 PM",
    },
  });

  const preschoolProgram = await prisma.program.upsert({
    where: { name: "Preschool Program" },
    update: {},
    create: {
      name: "Preschool Program",
      description: "Structured learning and kindergarten readiness for ages 3-4",
      ageRange: "3 - 4 years",
      capacity: 20,
      tuitionFee: 1100.00,
      schedule: "Monday - Friday, 7:00 AM - 5:00 PM",
    },
  });

  const preKProgram = await prisma.program.upsert({
    where: { name: "Pre-K Program" },
    update: {},
    create: {
      name: "Pre-K Program",
      description: "Advanced learning and school preparation for ages 4-5",
      ageRange: "4 - 5 years",
      capacity: 20,
      tuitionFee: 1000.00,
      schedule: "Monday - Friday, 7:00 AM - 5:00 PM",
    },
  });
  console.log("✅ Created Programs: Infant, Toddler, Preschool, Pre-K");

  // 7. Create Classes
  const infantClass = await prisma.class.upsert({
    where: { name: "Sunshine Room (Infants)" },
    update: {},
    create: {
      name: "Sunshine Room (Infants)",
      programId: infantProgram.id,
      capacity: 12,
      teacherId: teacher1.id,
    },
  });

  const toddlerClass = await prisma.class.upsert({
    where: { name: "Rainbow Room (Toddlers)" },
    update: {},
    create: {
      name: "Rainbow Room (Toddlers)",
      programId: toddlerProgram.id,
      capacity: 15,
      teacherId: teacher2.id,
    },
  });

  const preschoolClass = await prisma.class.upsert({
    where: { name: "Stars Room (Preschool)" },
    update: {},
    create: {
      name: "Stars Room (Preschool)",
      programId: preschoolProgram.id,
      capacity: 20,
      teacherId: teacher1.id,
    },
  });

  const preKClass = await prisma.class.upsert({
    where: { name: "Explorers Room (Pre-K)" },
    update: {},
    create: {
      name: "Explorers Room (Pre-K)",
      programId: preKProgram.id,
      capacity: 20,
      teacherId: teacher2.id,
    },
  });
  console.log("✅ Created Classes: Sunshine, Rainbow, Stars, Explorers");

  // 8. Create Children
  const child1 = await prisma.child.create({
    data: {
      firstName: "Emma",
      lastName: "Smith",
      dateOfBirth: new Date("2024-06-15"),
      allergies: "Peanuts, Tree nuts",
      medicalNotes: "EpiPen required at all times",
      parentId: parent1.id,
    },
  });

  const child2 = await prisma.child.create({
    data: {
      firstName: "Liam",
      lastName: "Smith",
      dateOfBirth: new Date("2022-03-20"),
      allergies: null,
      medicalNotes: null,
      parentId: parent1.id,
    },
  });

  const child3 = await prisma.child.create({
    data: {
      firstName: "Sofia",
      lastName: "Garcia",
      dateOfBirth: new Date("2023-08-10"),
      allergies: "Dairy",
      medicalNotes: "Lactose intolerant",
      parentId: parent2.id,
    },
  });

  const child4 = await prisma.child.create({
    data: {
      firstName: "Noah",
      lastName: "Wilson",
      dateOfBirth: new Date("2021-11-05"),
      allergies: null,
      medicalNotes: "Asthma - inhaler as needed",
      parentId: parent3.id,
    },
  });
  console.log("✅ Created Children: Emma, Liam, Sofia, Noah");

  // 9. Create Applications
  const app1 = await prisma.application.create({
    data: {
      childId: child1.id,
      programId: infantProgram.id,
      status: ApplicationStatus.APPROVED,
      preferredStartDate: new Date("2025-02-01"),
      submittedAt: new Date("2025-01-01"),
      reviewedAt: new Date("2025-01-05"),
      reviewedBy: admin.id,
    },
  });

  const app2 = await prisma.application.create({
    data: {
      childId: child2.id,
      programId: toddlerProgram.id,
      status: ApplicationStatus.APPROVED,
      preferredStartDate: new Date("2025-02-01"),
      submittedAt: new Date("2025-01-02"),
      reviewedAt: new Date("2025-01-06"),
      reviewedBy: admin.id,
    },
  });

  const app3 = await prisma.application.create({
    data: {
      childId: child3.id,
      programId: preschoolProgram.id,
      status: ApplicationStatus.UNDER_REVIEW,
      preferredStartDate: new Date("2025-03-01"),
      submittedAt: new Date("2025-01-15"),
    },
  });

  const app4 = await prisma.application.create({
    data: {
      childId: child4.id,
      programId: preKProgram.id,
      status: ApplicationStatus.SUBMITTED,
      preferredStartDate: new Date("2025-02-15"),
      submittedAt: new Date("2025-01-18"),
    },
  });
  console.log("✅ Created Applications with various statuses");

  // 10. Create Enrollments
  const enrollment1 = await prisma.enrollment.create({
    data: {
      childId: child1.id,
      classId: infantClass.id,
      applicationId: app1.id,
      status: EnrollmentStatus.ACTIVE,
      startDate: new Date("2025-02-01"),
    },
  });

  const enrollment2 = await prisma.enrollment.create({
    data: {
      childId: child2.id,
      classId: toddlerClass.id,
      applicationId: app2.id,
      status: EnrollmentStatus.ACTIVE,
      startDate: new Date("2025-02-01"),
    },
  });
  console.log("✅ Created Active Enrollments for Emma and Liam");

  // 11. Create Message Threads
  const thread1 = await prisma.messageThread.create({
    data: {
      childId: child1.id,
      classId: infantClass.id,
    },
  });

  const thread2 = await prisma.messageThread.create({
    data: {
      childId: child2.id,
      classId: toddlerClass.id,
    },
  });
  console.log("✅ Created Message Threads");

  // 12. Create Messages
  await prisma.message.create({
    data: {
      threadId: thread1.id,
      senderId: parent1.id,
      content: "Hello! How is Emma adjusting to the infant room?",
    },
  });

  await prisma.message.create({
    data: {
      threadId: thread1.id,
      senderId: teacher1.id,
      content: "Emma is doing wonderfully! She's very happy and engaging well with the other infants. She especially loves music time.",
    },
  });

  await prisma.message.create({
    data: {
      threadId: thread2.id,
      senderId: teacher2.id,
      content: "Hi! Just wanted to let you know that Liam had a great day today. He made a new friend during outdoor play!",
    },
  });
  console.log("✅ Created Sample Messages");

  // 13. Create Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "APPLICATION_APPROVED",
      entityType: "Application",
      entityId: app1.id,
      metadata: {
        oldStatus: ApplicationStatus.UNDER_REVIEW,
        newStatus: ApplicationStatus.APPROVED,
        childName: "Emma Smith",
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "ENROLLMENT_ACTIVATED",
      entityType: "Enrollment",
      entityId: enrollment1.id,
      metadata: {
        childName: "Emma Smith",
        className: "Sunshine Room (Infants)",
        startDate: "2025-02-01",
      },
    },
  });
  console.log("✅ Created Audit Logs");

  console.log("\n🎉 Seeding completed successfully!");
  console.log("\n📝 Test Accounts:");
  console.log("   Principal: principal@mimodaycare.com");
  console.log("   Admin: admin@mimodaycare.com");
  console.log("   Executive: executive@mimodaycare.com");
  console.log("   Teacher 1: teacher1@mimodaycare.com");
  console.log("   Teacher 2: teacher2@mimodaycare.com");
  console.log("   Parent 1: parent1@example.com");
  console.log("   Parent 2: parent2@example.com");
  console.log("   Parent 3: parent3@example.com");
  console.log("   Password (all): Password123!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

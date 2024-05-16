-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'DOCTOR', 'NURSE', 'PATIENT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "armyNo" TEXT,
    "unit" TEXT,
    "rank" TEXT,
    "dateOfCommission" TIMESTAMP(3),
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobileNo" TEXT,
    "dob" TIMESTAMP(3),
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalRecord" (
    "id" TEXT NOT NULL,
    "heightCm" INTEGER,
    "weightKg" DOUBLE PRECISION,
    "BMI" DOUBLE PRECISION,
    "chest" INTEGER,
    "waist" INTEGER,
    "bloodPressure" TEXT,
    "disabilities" TEXT,
    "bloodGroup" TEXT,
    "onDrug" BOOLEAN NOT NULL,
    "date" TIMESTAMP(3),
    "patientId" TEXT NOT NULL DEFAULT '27c57ab0-8e7c-4368-b22d-c2db71b316f9',

    CONSTRAINT "MedicalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Treatment" (
    "id" TEXT NOT NULL,
    "presentmedication" TEXT NOT NULL,
    "pastmedication" TEXT NOT NULL,
    "pasthospitalisation" TEXT NOT NULL,
    "significantpasthistory" TEXT NOT NULL,
    "knownallergies" TEXT NOT NULL,
    "miscellaneous" TEXT NOT NULL,
    "patientId" TEXT NOT NULL DEFAULT '27c57ab0-8e7c-4368-b22d-c2db71b316f9',

    CONSTRAINT "Treatment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "testFor" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "ameid" TEXT NOT NULL,
    "pmeid" TEXT NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ame" (
    "ameid" TEXT NOT NULL,
    "patientId" TEXT NOT NULL DEFAULT '27c57ab0-8e7c-4368-b22d-c2db71b316f9',
    "description" TEXT NOT NULL,

    CONSTRAINT "ame_pkey" PRIMARY KEY ("ameid")
);

-- CreateTable
CREATE TABLE "pme" (
    "pmeid" TEXT NOT NULL,
    "patientId" TEXT NOT NULL DEFAULT '27c57ab0-8e7c-4368-b22d-c2db71b316f9',
    "description" TEXT NOT NULL,

    CONSTRAINT "pme_pkey" PRIMARY KEY ("pmeid")
);

-- CreateTable
CREATE TABLE "_PatientToTest" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MedicalRecordToTreatment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MedicalRecordToTest" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_TestToTreatment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobileNo_key" ON "User"("mobileNo");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_userId_key" ON "Patient"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_PatientToTest_AB_unique" ON "_PatientToTest"("A", "B");

-- CreateIndex
CREATE INDEX "_PatientToTest_B_index" ON "_PatientToTest"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MedicalRecordToTreatment_AB_unique" ON "_MedicalRecordToTreatment"("A", "B");

-- CreateIndex
CREATE INDEX "_MedicalRecordToTreatment_B_index" ON "_MedicalRecordToTreatment"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MedicalRecordToTest_AB_unique" ON "_MedicalRecordToTest"("A", "B");

-- CreateIndex
CREATE INDEX "_MedicalRecordToTest_B_index" ON "_MedicalRecordToTest"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TestToTreatment_AB_unique" ON "_TestToTreatment"("A", "B");

-- CreateIndex
CREATE INDEX "_TestToTreatment_B_index" ON "_TestToTreatment"("B");

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Treatment" ADD CONSTRAINT "Treatment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_ameid_fkey" FOREIGN KEY ("ameid") REFERENCES "ame"("ameid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_pmeid_fkey" FOREIGN KEY ("pmeid") REFERENCES "pme"("pmeid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ame" ADD CONSTRAINT "ame_ameid_fkey" FOREIGN KEY ("ameid") REFERENCES "MedicalRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ame" ADD CONSTRAINT "ame_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pme" ADD CONSTRAINT "pme_pmeid_fkey" FOREIGN KEY ("pmeid") REFERENCES "MedicalRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pme" ADD CONSTRAINT "pme_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatientToTest" ADD CONSTRAINT "_PatientToTest_A_fkey" FOREIGN KEY ("A") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatientToTest" ADD CONSTRAINT "_PatientToTest_B_fkey" FOREIGN KEY ("B") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MedicalRecordToTreatment" ADD CONSTRAINT "_MedicalRecordToTreatment_A_fkey" FOREIGN KEY ("A") REFERENCES "MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MedicalRecordToTreatment" ADD CONSTRAINT "_MedicalRecordToTreatment_B_fkey" FOREIGN KEY ("B") REFERENCES "Treatment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MedicalRecordToTest" ADD CONSTRAINT "_MedicalRecordToTest_A_fkey" FOREIGN KEY ("A") REFERENCES "MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MedicalRecordToTest" ADD CONSTRAINT "_MedicalRecordToTest_B_fkey" FOREIGN KEY ("B") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TestToTreatment" ADD CONSTRAINT "_TestToTreatment_A_fkey" FOREIGN KEY ("A") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TestToTreatment" ADD CONSTRAINT "_TestToTreatment_B_fkey" FOREIGN KEY ("B") REFERENCES "Treatment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

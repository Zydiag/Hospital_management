/*
  Warnings:

  - You are about to drop the column `ameid` on the `Test` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `Test` table. All the data in the column will be lost.
  - You are about to drop the column `pmeid` on the `Test` table. All the data in the column will be lost.
  - You are about to drop the column `knownallergies` on the `Treatment` table. All the data in the column will be lost.
  - You are about to drop the column `miscellaneous` on the `Treatment` table. All the data in the column will be lost.
  - You are about to drop the column `pasthospitalisation` on the `Treatment` table. All the data in the column will be lost.
  - You are about to drop the column `pastmedication` on the `Treatment` table. All the data in the column will be lost.
  - You are about to drop the column `presentmedication` on the `Treatment` table. All the data in the column will be lost.
  - You are about to drop the column `significantpasthistory` on the `Treatment` table. All the data in the column will be lost.
  - You are about to drop the `MedicalRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MedicalRecordToTest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MedicalRecordToTreatment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PatientToTest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TestToTreatment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ame` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pme` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `doctorId` to the `Department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Test` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Treatment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorId` to the `Treatment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshToken` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `armyNo` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "MedicalRecord" DROP CONSTRAINT "MedicalRecord_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_ameid_fkey";

-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_pmeid_fkey";

-- DropForeignKey
ALTER TABLE "Treatment" DROP CONSTRAINT "Treatment_patientId_fkey";

-- DropForeignKey
ALTER TABLE "_MedicalRecordToTest" DROP CONSTRAINT "_MedicalRecordToTest_A_fkey";

-- DropForeignKey
ALTER TABLE "_MedicalRecordToTest" DROP CONSTRAINT "_MedicalRecordToTest_B_fkey";

-- DropForeignKey
ALTER TABLE "_MedicalRecordToTreatment" DROP CONSTRAINT "_MedicalRecordToTreatment_A_fkey";

-- DropForeignKey
ALTER TABLE "_MedicalRecordToTreatment" DROP CONSTRAINT "_MedicalRecordToTreatment_B_fkey";

-- DropForeignKey
ALTER TABLE "_PatientToTest" DROP CONSTRAINT "_PatientToTest_A_fkey";

-- DropForeignKey
ALTER TABLE "_PatientToTest" DROP CONSTRAINT "_PatientToTest_B_fkey";

-- DropForeignKey
ALTER TABLE "_TestToTreatment" DROP CONSTRAINT "_TestToTreatment_A_fkey";

-- DropForeignKey
ALTER TABLE "_TestToTreatment" DROP CONSTRAINT "_TestToTreatment_B_fkey";

-- DropForeignKey
ALTER TABLE "ame" DROP CONSTRAINT "ame_ameid_fkey";

-- DropForeignKey
ALTER TABLE "ame" DROP CONSTRAINT "ame_patientId_fkey";

-- DropForeignKey
ALTER TABLE "pme" DROP CONSTRAINT "pme_patientId_fkey";

-- DropForeignKey
ALTER TABLE "pme" DROP CONSTRAINT "pme_pmeid_fkey";

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "doctorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Test" DROP COLUMN "ameid",
DROP COLUMN "image_url",
DROP COLUMN "pmeid",
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "patientId" TEXT,
ADD COLUMN     "treatmentId" TEXT;

-- AlterTable
ALTER TABLE "Treatment" DROP COLUMN "knownallergies",
DROP COLUMN "miscellaneous",
DROP COLUMN "pasthospitalisation",
DROP COLUMN "pastmedication",
DROP COLUMN "presentmedication",
DROP COLUMN "significantpasthistory",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "doctorId" TEXT NOT NULL,
ALTER COLUMN "patientId" DROP NOT NULL,
ALTER COLUMN "patientId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT NOT NULL,
ALTER COLUMN "armyNo" SET NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'PATIENT';

-- DropTable
DROP TABLE "MedicalRecord";

-- DropTable
DROP TABLE "_MedicalRecordToTest";

-- DropTable
DROP TABLE "_MedicalRecordToTreatment";

-- DropTable
DROP TABLE "_PatientToTest";

-- DropTable
DROP TABLE "_TestToTreatment";

-- DropTable
DROP TABLE "ame";

-- DropTable
DROP TABLE "pme";

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "refreshToken" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medical" (
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
    "patientId" TEXT NOT NULL,

    CONSTRAINT "Medical_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "departmentId" TEXT,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "treatmentId" TEXT,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Medical_patientId_key" ON "Medical"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_userId_key" ON "Doctor"("userId");

-- AddForeignKey
ALTER TABLE "Medical" ADD CONSTRAINT "Medical_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Treatment" ADD CONSTRAINT "Treatment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Treatment" ADD CONSTRAINT "Treatment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Familyhistory" (
    "id" TEXT NOT NULL,
    "Hypertension" TEXT NOT NULL,
    "Diabetes_Mellitus" TEXT NOT NULL,
    "Any_Unnatural_Death" TEXT NOT NULL,
    "Any_other_significant_history" TEXT NOT NULL,

    CONSTRAINT "Familyhistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Familyhistory" ADD CONSTRAINT "Familyhistory_id_fkey" FOREIGN KEY ("id") REFERENCES "Medical"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

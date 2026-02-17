#!/bin/bash
# Seed script to create 12 dean accounts for testing
# Run this AFTER the backend is started at http://localhost:8080
#
# Each dean:
#   1. Gets registered via /auth/register (creates user with ADMIN role)
#   2. Gets their email, name, and school set via direct SQL

set -e

API="http://localhost:8080"
DB_NAME="pdlogical"
DB_USER="postgres"
DB_PASS="password"

# Export password for psql
export PGPASSWORD="$DB_PASS"

echo "============================================"
echo "  Seeding 12 Dean Accounts"
echo "============================================"

# Dean data: username|password|email|name|school_name
DEANS=(
  "dean.oad|Dean@OAD2026|dean.oad@krmangalam.edu.in|Dean OAD|Architecture & Design"
  "dean.sbas|Dean@SBAS2026|dean.sbas@krmangalam.edu.in|Dean SBAS|Basic & Applied Sciences"
  "dean.smas|Dean@SMAS2026|dean.smas@krmangalam.edu.in|Dean SMAS|Medical & Allied Sciences - Pharmacy"
  "dean.soed|Dean@SOED2026|dean.soed@krmangalam.edu.in|Dean SOED|Education"
  "dean.sohmct|Dean@SOHMCT2026|dean.sohmct@krmangalam.edu.in|Dean SOHMCT|Hotel Mgmt. & Catering Tech."
  "dean.sprs|Dean@SPRS2026|dean.sprs@krmangalam.edu.in|Dean SPRS|Physiotherapy & Rehab Sciences"
  "dean.soas|Dean@SOAS2026|dean.soas@krmangalam.edu.in|Dean SOAS|Agriculture"
  "dean.semce|Dean@SEMCE2026|dean.semce@krmangalam.edu.in|Dean SEMCE|Media & Communication"
  "dean.sola|Dean@SOLA2026|dean.sola@krmangalam.edu.in|Dean SOLA|Liberal Arts"
  "dean.soet|Dean@SOET2026|dean.soet@krmangalam.edu.in|Dean SOET|Engineering & Technology"
  "dean.somc|Dean@SOMC2026|dean.somc@krmangalam.edu.in|Dean SOMC|Management & Commerce"
  "dean.sols|Dean@SOLS2026|dean.sols@krmangalam.edu.in|Dean SOLS|Law"
)

for entry in "${DEANS[@]}"; do
  IFS='|' read -r USERNAME PASSWORD EMAIL NAME SCHOOL <<< "$entry"

  echo ""
  echo "→ Creating dean: ${USERNAME} (${SCHOOL})"

  # Step 1: Register via API
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${API}/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"username\": \"${USERNAME}\", \"password\": \"${PASSWORD}\"}")

  if [ "$HTTP_CODE" = "201" ]; then
    echo "  ✓ Registered user"
  elif [ "$HTTP_CODE" = "500" ] || [ "$HTTP_CODE" = "409" ]; then
    echo "  ⚠ User may already exist (HTTP ${HTTP_CODE}), continuing..."
  else
    echo "  ✗ Registration failed (HTTP ${HTTP_CODE})"
    continue
  fi

  # Step 2: Update user details (email, name) and create teacher_profile with school
  psql -h localhost -U "$DB_USER" -d "$DB_NAME" -q <<SQL
    -- Set email and name
    UPDATE users
    SET email = '${EMAIL}', name = '${NAME}'
    WHERE username = '${USERNAME}';

    -- Create teacher_profile with school (only if not exists)
    INSERT INTO teacher_profiles (user_id, school, department, designation)
    SELECT u.id, '${SCHOOL}', 'Dean Office', 'Dean'
    FROM users u
    WHERE u.username = '${USERNAME}'
      AND NOT EXISTS (
        SELECT 1 FROM teacher_profiles tp WHERE tp.user_id = u.id
      );
SQL

  echo "  ✓ Set email=${EMAIL}, school=${SCHOOL}"

done

echo ""
echo "============================================"
echo "  ✅ All 12 Dean accounts seeded!"
echo "============================================"
echo ""
echo "Login at http://localhost:3000/auth/login"
echo "See docs/dean_credentials.md for all credentials"

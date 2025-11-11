import xlsx from "xlsx";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Generate sample data
const generateData = (rows = 100) => {
  const data = [];
  const firstNames = [
    "John",
    "Jane",
    "Michael",
    "Sarah",
    "David",
    "Emily",
    "Robert",
    "Lisa",
    "James",
    "Mary",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
  ];
  const cities = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
  ];

  for (let i = 1; i <= rows; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];

    data.push({
      Name: `${firstName} ${lastName}`,
      Email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      Phone: `555-${String(Math.floor(Math.random() * 10000)).padStart(
        4,
        "0"
      )}`,
      Address: `${Math.floor(Math.random() * 9999) + 1} Main St`,
      City: city,
      Age: Math.floor(Math.random() * 50) + 20,
      Department: ["Sales", "Marketing", "Engineering", "HR", "Finance"][
        Math.floor(Math.random() * 5)
      ],
      Salary: Math.floor(Math.random() * 100000) + 40000,
    });
  }

  return data;
};

// Create workbook
const createExcelFile = (rows = 100, filename = "test_data.xlsx") => {
  console.log(`📊 Generating ${rows} rows of test data...`);

  const data = generateData(rows);
  const worksheet = xlsx.utils.json_to_sheet(data);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Users");

  const outputPath = join(__dirname, "..", filename);
  xlsx.writeFile(workbook, outputPath);

  console.log(`✅ Created ${filename} with ${rows} rows`);
  console.log(`📁 Location: ${outputPath}`);
};

// Get rows from command line argument
const rows = parseInt(process.argv[2]) || 100;
const filename = process.argv[3] || "test_data.xlsx";

createExcelFile(rows, filename);

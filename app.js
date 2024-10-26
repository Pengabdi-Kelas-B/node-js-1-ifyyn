const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const app = {};

// Membuat folder
app.makeFolder = () => {
  rl.question("Masukkan Nama Folder: ", (folderName) => {
    fs.mkdir(path.join(__dirname, folderName), { recursive: true }, (err) => {
      if (err) {
        console.error("Gagal membuat folder:", err.message);
      } else {
        console.log(`Folder ${folderName} berhasil dibuat.`);
      }
      rl.close();
    });
  });
};

// Membuat file
app.makeFile = () => {
  rl.question("Masukkan Nama File (termasuk ekstensi): ", (fileName) => {
    rl.question("Masukkan isi file: ", (content) => {
      fs.writeFile(path.join(__dirname, fileName), content, (err) => {
        if (err) {
          console.error("Gagal membuat file:", err.message);
        } else {
          console.log(`File ${fileName} berhasil dibuat.`);
        }
        rl.close();
      });
    });
  });
};

// Membaca isi folder
app.readFolder = () => {
  rl.question("Masukkan Nama Folder: ", (folderName) => {
    const folderPath = path.join(__dirname, folderName);
    if (!fs.existsSync(folderPath)) {
      console.log(`Folder ${folderName} tidak ditemukan.`);
      rl.close();
      return;
    }

    const files = fs.readdirSync(folderPath);
    const fileDetails = files.map((file) => {
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);

      return {
        namaFile: file,
        extensi: path.extname(file).substring(1),
        jenisFile: stats.isFile() ? "file" : "folder",
        tanggalDibuat: stats.birthtime.toISOString().split("T")[0],
        ukuranFile: `${(stats.size / 1024).toFixed(2)} KB`,
      };
    });

    console.log(`Berhasil menampilkan isi dari folder ${folderName}:`);
    console.log(JSON.stringify(fileDetails, null, 2));
    rl.close();
  });
};

// Membaca isi file
app.readFile = () => {
  rl.question("Masukkan Nama File: ", (fileName) => {
    const filePath = path.join(__dirname, fileName);
    if (!fs.existsSync(filePath)) {
      console.log(`File ${fileName} tidak ditemukan.`);
      rl.close();
      return;
    }

    const ext = path.extname(fileName);
    if (ext !== ".txt") {
      console.log("Hanya mendukung membaca file teks.");
      rl.close();
      return;
    }

    const content = fs.readFileSync(filePath, "utf-8");
    console.log(`Isi dari file ${fileName}:\n`);
    console.log(content);
    rl.close();
  });
};

// Merapikan file berdasarkan ekstensi
app.extSorter = () => {
  rl.question("Masukkan Nama Folder Sumber: ", (sourceFolder) => {
    const sourcePath = path.join(__dirname, sourceFolder);
    if (!fs.existsSync(sourcePath)) {
      console.log(`Folder ${sourceFolder} tidak ditemukan.`);
      rl.close();
      return;
    }

    const files = fs.readdirSync(sourcePath);

    files.forEach((file) => {
      const ext = path.extname(file).substring(1) || "unknown";
      const destinationFolder = path.join(__dirname, ext);

      if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder);
      }

      const sourceFilePath = path.join(sourcePath, file);
      const destinationFilePath = path.join(destinationFolder, file);

      fs.renameSync(sourceFilePath, destinationFilePath);
      console.log(`File ${file} dipindahkan ke folder ${ext}`);
    });

    console.log("Proses merapikan file selesai.");
    rl.close();
  });
};

module.exports = app;

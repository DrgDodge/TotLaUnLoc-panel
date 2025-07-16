<div class="flex flex-col items-center justify-center h-full p-8">
  <div class="bg-neutral-800 p-10 rounded-xl shadow-2xl text-neutral-100 max-w-4xl w-full border border-neutral-700">
    <h2 class="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 leading-tight text-center">
      About TotLaUnLoc: Secure & Efficient Account Management
    </h2>
    <p class="text-lg mb-4 leading-relaxed">
      TotLaUnLoc is a powerful and intuitive desktop application designed to streamline your digital security. For individual users, it provides a fast and easy way to view all saved accounts on your device, allowing you to quickly delete unwanted entries or perform bulk deletions. It also securely manages your Time-based One-Time Passwords (TOTP) and checks if your accounts have been compromised in known data breaches.
    </p>
    <p class="text-lg mb-4 leading-relaxed">
      For security professionals and IT administrators, TotLaUnLoc offers robust features to manage tens or hundreds of devices using our license keys. This enables efficient oversight and control over multiple installations, ensuring consistent security policies across your organization.
    </p>
    <p class="text-lg mb-6 leading-relaxed">
      It's important to note that the application does not access or decrypt passwords stored by browsers. Instead, TotLaUnLoc empowers you to manage accounts saved across most browsers, offering functionalities such as individually deleting an account with its associated password or deleting all passwords from a browser profile. The application provides a modern, intuitive, and easy-to-use interface for organizing credentials and ensures data confidentiality through local encryption.
    </p>

    <h3 class="text-3xl font-semibold mb-4 text-blue-300">Technology Stack</h3>
    <p class="text-lg mb-4 leading-relaxed">
      The application is built using a modern technology stack, combining a Svelte-based frontend with a robust backend written in Rust, all integrated into a desktop application using the Tauri framework.
    </p>
    <ul class="list-disc list-inside text-lg mb-4 pl-4">
      <li><strong class="text-purple-300">Frontend:</strong> Developed with Svelte, a reactive JavaScript framework that enables the creation of fast and efficient user interfaces. The interface is designed to be intuitive and responsive.</li>
      <li><strong class="text-purple-300">Backend:</strong> Implemented in Rust, a programming language known for its safety, performance, and concurrency. The backend manages business logic, including data encryption, interaction with the SQLite database, and TOTP code generation.</li>
      <li><strong class="text-purple-300">Tauri:</strong> Utilizes Tauri to package the web application (Svelte) into a native desktop application, providing access to operating system-specific functionalities and a reduced resource footprint.</li>
      <li><strong class="text-purple-300">Encryption:</strong> All sensitive data is encrypted locally to ensure maximum confidentiality and security.</li>
      <li><strong class="text-purple-300">Data Breach Verification:</strong> It is important to note that the application does not access or decrypt passwords stored by browsers. The data breach verification functionality is performed by comparing the website name and account/username with a local database of known breaches, thus ensuring the confidentiality of your passwords. No passwords are sent to external servers during this process.</li>
      <li><strong class="text-purple-300">TOTP:</strong> Integration with the <code class="bg-neutral-700 px-1 rounded">totp-rs</code> library allows for the generation and management of time-based one-time authentication codes.</li>
    </ul>
  </div>
</div>

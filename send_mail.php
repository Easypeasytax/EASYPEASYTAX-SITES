<?php
$to = "easypeasytax@gmail.com";
$subject = "New Requirement Form Submission";

// Collect form data safely
$name = htmlspecialchars($_POST["Full Name"]);
$email = htmlspecialchars($_POST["Email"]);
$phone = htmlspecialchars($_POST["Phone"]);
$service = htmlspecialchars($_POST["Service"]);
$details = htmlspecialchars($_POST["Details"]);

// Email body
$message = "
New Requirement Received:

Name: $name
Email: $email
Phone: $phone
Service: $service

Details:
$details
";

// Create a boundary
$boundary = md5(time());
$headers = "MIME-Version: 1.0\r\n";
$headers .= "From: $email\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"".$boundary."\"\r\n\r\n";

// Start message
$body = "--$boundary\r\n";
$body .= "Content-Type: text/plain; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
$body .= $message . "\r\n";

// Handle file attachments
$files = ['file1', 'file2', 'file3'];
foreach ($files as $fileInput) {
    if (isset($_FILES[$fileInput]) && $_FILES[$fileInput]['error'] === UPLOAD_ERR_OK) {
        $fileName = $_FILES[$fileInput]['name'];
        $fileTmpPath = $_FILES[$fileInput]['tmp_name'];
        $fileData = chunk_split(base64_encode(file_get_contents($fileTmpPath)));
        $fileType = mime_content_type($fileTmpPath);

        $body .= "--$boundary\r\n";
        $body .= "Content-Type: $fileType; name=\"$fileName\"\r\n";
        $body .= "Content-Disposition: attachment; filename=\"$fileName\"\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= $fileData . "\r\n";
    }
}

$body .= "--$boundary--";

// Send the email
if (mail($to, $subject, $body, $headers)) {
    echo "Success! Your requirement has been sent.";
} else {
    echo "Sorry, your form could not be sent.";
}
?>

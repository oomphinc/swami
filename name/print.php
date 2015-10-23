<?php

if(!isset($_POST['image']) || !($image = base64_decode(substr($_POST['image'], 21))))  {
http_response_code(500);
exit(1);
}

$tmpfname = tempnam("/tmp", "image");

file_put_contents($tmpfname, $image);

system("lpr -o media=DC07 -o BrMargin=0 -o BrHalftonePattern=BrBinary $tmpfname");

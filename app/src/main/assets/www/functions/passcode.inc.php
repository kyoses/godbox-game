<?php
session_start();
  $img_width=50;//图片宽度；
  $img_height=16;//图片高度；
  srand(microtime() * 100000);//设随机数种子，microtime()函数的作用是：返回当前Unix时间戳和微秒数（百万分之一秒）；
  for($ti=0;$ti<4;$ti++){
    $new_number.=dechex(rand(0,15));//rand随机取个16位，dechex转为十进制；
  }//随机取四位；
  $new_number=strtolower($new_number);//字符串全转为小写；
  $_SESSION['verifycode']=$new_number;//存入session；
  $number_img=imageCreate($img_width,$img_height);//创建图象；
  ImageColorAllocate($number_img,255,255,255);//绘制颜色；
  for($i=1;$i<=128;$i++){
    imageString($number_img,1,mt_rand(1,$img_width),mt_rand(1,$img_height),"*",imageColorAllocate($number_img,mt_rand(200,255),mt_rand(200,255),mt_rand(200,255)));
  }
 /* ImageString
	绘横式字符串。
	语法: int imagestring(int im, int font, int x, int y, string s, int col);
	返回值: 整数
	函数种类: 图形处理
	内容说明 
	本函数在图片上绘出水平的横式字符串。参数 font 为字形，设为 1 到 5 表示使用默认字形。参数 x、y 为字符串起点坐标。字符串的内容放在参数 s 。参数 col 表示字符串的颜色。
	mt_rand 取乱数值
	例如 mt_rand(38, 49) 则会从 38 到 49 之间取一个乱数值。值得注意的是为使乱数的乱度最大，每次在取乱数之前最好使用 mt_srand() 以设定新的乱数种子。
*/
  for($i=0;$i<strlen($new_number);$i++){//strlen（）返回字符串长度；
    imageString($number_img,mt_rand(3,5),$i*$img_width/4+mt_rand(1,4),mt_rand(1,$img_height/5), $new_number[$i],imageColorAllocate($number_img,mt_rand(0,100),mt_rand(0,150),mt_rand(0,200)));
  } 
  ImagePng($number_img);//建立PNG 图型
  ImageDestroy($number_img);//释放与 image 关联的内存
?>
<?php
 
class Lib{
   public static function autoLoadClass($class){
 
        $fileDir = dirname(__FILE__).'/class/'.$class.'.class.php';
        //if(file_exists($fileDir)){
            //echo $fileDir;exit();
            include_once $fileDir;
        //}
    }  
}


spl_autoload_register('Lib::autoLoadClass');
?>

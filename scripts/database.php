<?php

$servername = "";
$username = "fiori";
$password = "raspberry";
$dbname = "okazje";
$resultMaterials = array();

$res = null;
$sql = null;
$conn = null;
$date = date("Y-m-d");
$operationType = "";

$ip_addr = array();
$ip_addr = ["192.168.137.151", "192.168.137.231", "192.168.1.83"];

//Material search string
$searchString = "";
$resultSearchMaterial = array();

//Material details
$resultProductDetailBasic = array();
$searchId = "";

//Matertial Links
$resultProductLinks = array();

//Material Prices
$resultProductPrices = array();

class CheckDevice {
	public function myOS(){
		if (strtoupper(substr(PHP_OS, 0, 3)) === (chr(87).chr(73).chr(78)))
			return true;
		return false;
	}
	public function ping($ip){
		if ($this->myOS()){
			if (!exec("ping -n 1 -w 1 ".$ip." 2>NUL > NUL && (echo 0) || (echo 1)"))
				return true;
		} else {
			if (!exec("ping -q -c1 ".$ip." >/dev/null 2>&1 ; echo $?"))
				return true;
		}
		return false;
	}
}

function getDataFromDatabase(){
	global $resultMaterials, $sql, $res, $conn, $date;

 	$sql = "SELECT T0.productFullName, T0.productId
     FROM productdetail AS T0
     GROUP BY T0.productId, T0.productFullName
     ORDER BY T0.productFullName
     LIMIT 40";
	 $res = mysqli_query($conn,$sql);

	 	while($row = mysqli_fetch_array($res)){
 		array_push($resultMaterials,
 		array('productFullName'=>$row[0], 'productId'=>$row[1]));
		}

	 clearSQL();
	 mysqli_close($conn);
}
function clearSQL() {
	global $res, $sql;
	$res = null;
	$sql = "";
}
function searchMaterial(){
	global $resultMaterials, $searchString, $sql, $res, $conn, $date;

	$searchString = str_replace(" ", "%", $searchString);
	$searchString = strtolower("%{$searchString}%");
	$searchStringLink = str_replace(" ", "%", $searchString);
	$searchStringLink = strtolower("%{$searchStringLink}");

	// $sql = "SELECT T0.productFullName, T0.productId
	//  FROM productdetail AS T0
	//  INNER JOIN product AS T1 on T0.productId = T1.productId
	//  INNER JOIN productLinks AS T2 on T1.productId = T2.productId
	//  WHERE T1.categoryId != '15'
	//  AND ( T0.productFullName LIKE '{$searchString}' OR T2.productURL LIKE '{$searchString}' )
	//  LIMIT 40";

	$sql = "SELECT T0.productFullName, T0.productId
	  FROM productdetail AS T0
	  INNER JOIN product AS T1 on T0.productId = T1.productId
	  INNER JOIN productlinks AS T2 on T1.productId = T2.productId
	  WHERE T1.categoryId != '15'
	  AND (T2.productURL LIKE '{$searchString}' 
	  OR T0.productFullName LIKE '{$searchString}')
	  LIMIT 40";

	 $res = mysqli_query($conn,$sql);
		if (mysqli_num_rows($res)==0) { echo null;}
	 	while($row = mysqli_fetch_array($res)){
 		array_push($resultMaterials,
		 array('productFullName'=>$row[0], 'productId'=>$row[1]));
		 }

	 clearSQL();
	 mysqli_close($conn);
}
function getMaterialDetails(){
	global $resultProductDetailBasic, $searchId, $sql, $res, $conn, $date;

	$sql = "SELECT T0.productId, T0.productFullName,
	T0.productModel, T0.productManufacturer,
	T0.productParameters, T0.productImageUrl,
	T0.productImagePath,T2.categoryDomain,
	T2.categoryName, T2.categoryId
	FROM productdetail AS T0
	INNER JOIN product AS T1 ON T0.productId = T1.productId
	INNER JOIN categories AS T2 ON T1.categoryId = T2.categoryId
	   WHERE T0.productId = '{$searchId}'";

	 $res = mysqli_query($conn,$sql);
	 if (mysqli_num_rows($res)==0) { echo null;}
	 	while($row = mysqli_fetch_array($res)){
 			array_push($resultProductDetailBasic,
		 		array(
			 		'productId'=>$row[0],
			 		'productFullName'=>$row[1],
			 		'productModel'=>$row[2],
			 		'productManufacturer'=>$row[3],
					'productParameters'=>$row[4],
					'productImageUrl'=>$row[5],
					'productImagePath'=>$row[6],
					'categoryDomain'=>$row[7],
					'categoryName'=>$row[8],
					'categoryId'=>$row[9]
			));
		}

	 clearSQL();
	 mysqli_close($conn);
}
function getMaterialLinks(){
	global $resultProductLinks, $searchId, $sql, $res, $conn, $date, $ip_addr;

	$sql = "SELECT productId, productUrl, productDomain, linkId, linkActive
	from productlinks
	WHERE productId = '{$searchId}'";

	$res = mysqli_query($conn,$sql);
	if (mysqli_num_rows($res)==0) { echo null;}
	 	while($row = mysqli_fetch_array($res)){
 			array_push($resultProductLinks,
		 		array(
			 		'productId'=>$row[0],
			 		'productUrl'=>$row[1],
			 		'productDomain'=>$row[2],
					'linkId'=>$row[3],
					'linkActive'=>$row[4]
			));
		}
	clearSQL();
	mysqli_close($conn);
}
function getMaterialPrices(){
	global $resultProductPrices, $searchId, $sql, $res, $conn, $date;

	$sql = "SELECT productPriceDate, productDomain,
	productPriceNow, productPricePrevious,
	productDiscountRate, productDiscounted,
	productOutlet
	from productprices
	WHERE productId = '{$searchId}'
	ORDER BY productPriceDate DESC
	LIMIT 20";

	$res = mysqli_query($conn,$sql);
	if (mysqli_num_rows($res)==0) { echo null;}
	 	while($row = mysqli_fetch_array($res)){
 			array_push($resultProductPrices,
		 		array(
			 		'productPriceDate'=>$row[0],
			 		'productDomain'=>$row[1],
			 		'productPriceNow'=>$row[2],
					'productPricePrevious'=>$row[3],
					'productDiscountRate'=>$row[4],
					'productDiscounted'=>$row[5],
					'productOutlet'=>$row[6]
			));
		}
	clearSQL();
	mysqli_close($conn);
}

$available_addres = "";
foreach ($ip_addr as $single_addr) {
	$success = (new CheckDevice())->ping($single_addr);
	if ($success){
		$available_addres = $single_addr;
		break;
	}
}
if ($available_addres == ""){
		echo "No connection available";
			return;
}
// Create connection
$conn = new mysqli($available_addres, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}

// MAIN PROGRAM
try{
	$searchString = $_GET['searchString'];
	$searchId = $_GET['searchId'];
	$operationType = $_GET['operation'];
}catch(Exception $e){}

$dataToJson = array();
if ($searchString !== ''){
	searchMaterial();
	$dataToJson['Products'] = $resultMaterials;
}else if ($searchId !==''){
	switch ($operationType) {
		case 'basic':
			getMaterialDetails();
			$dataToJson['ProductDetailBasic'] = $resultProductDetailBasic;
			break;
		case 'links':
			getMaterialLinks();
			$dataToJson['ProductLinks'] = $resultProductLinks;
			break;
		case 'prices':
			getMaterialPrices();
			$dataToJson['ProductPrices'] = $resultProductPrices;
			break;
		default:
			echo "error kurwo";
			break;
	}
}else{
	getDataFromDatabase();
	$dataToJson['Products'] = $resultMaterials;
}
echo json_encode($dataToJson);
?>
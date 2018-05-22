<?php

class jwt {

    private $secret = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    private $issuer = '';
    private $expire = 3600 * 8;
    private $header = ["alg" => "HS256", "typ" => "JWT"];
    private $payload = [
        "iss" => null,
        "sub" => null,
        "exp" => null
    ];

    private $payloadDecoded = null;

    private function b64encode($string) {
        $string = base64_encode($string);
        $string = strtr($string, '+/', '-_');
        return rtrim($string, '='); 
    } 
     
    private function b64decode($string) {
        $string = strtr($string, '-_', '+/');
        $string = str_pad($string, strlen($string) % 4, '=', STR_PAD_RIGHT); 
        return base64_decode($string);
    }
    
    private function signature( $message, $secret ) {
        $signatured =  hash_hmac('sha256', $message, $secret, true);
        return $this->b64encode($signatured);
    }

    function authorization( $sub ) {
        $this->payload['iss'] = $this->issuer;
        $this->payload['sub'] = (string) $sub;
        $this->payload['exp'] = $this->expire + time();

        $header = json_encode($this->header);
        $header = $this->b64encode($header);

        $payload = json_encode($this->payload);
        $payload = $this->b64encode($payload);

        $message = $header .'.'. $payload;
        $signature = $this->signature($message, $this->secret);

        return $message. '.' .$signature;
    }

    function verify( $hash ) {
        if(substr_count($hash, '.') < 2) return false;
        
        list($header, $payload, $signature) = explode('.', $hash);
        $message = $header.'.'.$payload;


        $header = $this->b64decode($header);
        $header = json_decode($header);
        if(!$header) return false;

        if($header->alg !== 'HS256' || $header->typ !== 'JWT')
            return false;

        $payload = $this->b64decode($payload);
        $payload = json_decode($payload);

        if(!$payload) return false;
        
        if(!$this->signature($message, $this->secret) === $signature) 
            return false;

        $this->payloadDecoded = $payload;
        return true;
    }

    function expired() {
        if(!$this->payloadDecoded) return false;

        if($this->payloadDecoded->exp < time()) return true;
        return false;
    }

    function renew() {
        if(!$this->payloadDecoded) return null;
        
        return $this->authorization( $this->payloadDecoded->sub );
    }

    function setSecret( $secret ) {
        $this->secret = $secret;
    }

    function setIssuer( $iss ) {
        $this->issuer = $iss;
    }
    
    function setExpire( $exp ) {
        $this->expire = $exp;
    }

    function getPayload( ) {
        return $this->payloadDecoded;
    }

}
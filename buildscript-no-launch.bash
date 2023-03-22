#!/bin/sh
#. ~/.nvm/nvm.sh
#nvm use v16.13.0
# folderis - thisscript, .git, front, back
echo Removing old resources...
cd Maitinimas-back/src/main/resources/public
rm -r -f ./*
echo Building react app...
cd ../../../../../Maitinimas-front/
if npm run build | grep "Failed\|failed\|error\|Error\|not found"
	then echo Npm build failed, try npm install first
	exit 1
else
	echo Npm build completed
fi
echo Copying build to target...
cd ../Maitinimas-back/src/main/resources/public/
cp -r ../../../../../Maitinimas-front/build/* .
echo Maven clean install...
cd ../../../../
mvn clean install

#if mvn clean install | grep "ERROR"
#	then echo Maven build failed
#	exit 2
#else
#	echo Maven build completed
#fi
#echo Starting tomcat on port 8081...
# mvn org.codehaus.cargo:cargo-maven2-plugin:1.7.7:run -Dcargo.maven.containerId=tomcat9x -Dcargo.servlet.port=8081 -Dcargo.maven.containerUrl=https://repo1.maven.org/maven2/org/apache/tomcat/tomcat/9.0.40/tomcat-9.0.40.zip
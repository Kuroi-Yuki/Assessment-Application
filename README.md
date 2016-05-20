Server Code can be found: https://github.com/Salsaduckingbeel/IoT-project-core


Developing a Cordova Mobile App with Ionic Framework
-----------------------------------------------------
The steps here were done on x64 windows 8.1 machine.

Follow these steps to install Cordova (https://evothings.com/doc/build/cordova-install-windows.html)
1.	Install Node.js. Cordova runs on the Node.js platform, which needs to be installed as the first step. Download installer from: http://nodejs.org
2.	Go ahead and run the downloaded installation file. Node.js needs to be added to the PATH environment variable, which is done by default.
3.	To test the installation, open a command window (make sure you open a new command window to get the updated path settings made by the Node.js installation), and type: 
$ node --version
If the version number is displayed, Node.js is installed and working!
4.	Install Git. Git is a version control system, which is used by Cordova behind-the-scenes. Download and install from: http://git-scm.com. Use the default setting.
5.	Install Cordova. Cordova is installed using the Node Package Manager (npm). Use the default setting. Type the following in the command window to install: 
$ npm install -g cordova
6.	Test the Cordova install by typing: 
$ cordova --version
If you see the version number, you have successfully installed Apache Cordova!

Follow these steps to install Java:
The Android SDK needs the Java Development Kit (JDK) to be installed (minimum version 1.6). Note that the Java Runtime Environment (JRE) is not sufficient, you will need the JDK. To check if you have the JDK installed already, type this on the command line:
$ javac -version
If you do not have the JDK installed, proceed as follows:
1.	Download the Java SE JDK (SE = Standard Edition) from Oracle: www.oracle.com/technetwork/java/javase/downloads/. 
2.	Go along and run the downloaded installer file. Using the default selections should be fine, but take a note of the directory in which you install the JDK. You will need to add this to the PATH in a later step below.
3.	Next, update your path to include the JDK. Open the Control Panel, click System and Security, click System, click Change settings, which will open the System Properties window. Select the Advanced tab, then click the Environment Variables button.
4.	In the list User variables select PATH and click the Edit button. (If there is no PATH entry in the list, click the New button to create one.)
5.	At the end of the field Variable value, add a semicolon followed by the path to the bin directory of the JDK install. Here is an example (note that this must be the actual path used for the install on your machine): 
;C:\Program Files\Java\jdk1.8.0_11\bin
An easy way to do this is to prepare the path to add in a text editor, then paste it at the end of the input field. When done click the OK button.
6.	Next add the JAVA_HOME variable if it is not present (and if it is in the list, you may need to update its value using the Edit button). Click the New button. In the field Variable name type: 
JAVA_HOME
In the field Variable value enter the path to the directory where the JDK is installed, without the semicolon and the /bin subdirectory, for example: 
C:\Program Files\Java\jdk1.8.0_11
Click the OK button.
7.	Click the OK button again to close the Environment Variables window.
8.	Now you are ready to test the install. Close any open command windows, and open a new command window and type: 
$ javac -version
If you see a version number you are done with the JDK install!

Follow these steps to install Ant:
Apache Ant is a build system for Java, which is used by Cordova and the Android SDK. To install Ant, follow these steps:
1.	Download Ant from here: ant.apache.org/bindownload.cgi. Get the zip download available at the page. Click the zip-file link for the most recent release, e.g. apache-ant-1.9.4-bin.zip, and save the file to your machine.
2.	Unpack the zip file to the directory on your machine where you want Ant to be installed. You can pick any directory for the install. In this guide we use this as an example: 
C:\Users\miki\ant
Note that the files in the ant package should go directly into this directory. Make a note of the directory as you will need to add it to the PATH.
3.	To add Ant to the PATH, open the Control Panel, click System and Security, click System, click Change settings, click the Advanced tab, then click the Environment Variables button.
4.	In the list User variables select PATH and click the Edit button.
5.	At the end of the field Variable value, add a semicolon followed by the path to the bin directory of the Ant install. Here is an example: 
;C:\Users\miki\ant\bin
Click the OK button.
6.	Next add the ANT_HOME variable. Click the New button. In the field Variable name type: 
ANT_HOME
In the field Variable value enter the path to the directory where Ant is installed, without the semicolon and the /bin subdirectory, for example: 
C:\Users\miki\ant
Click the OK button.
7.	Click the OK button again to close the Environment Variables window.
8.	Now test the install. Close any open command windows, and open a new command window and type: 
$ ant -version
If you see a version number you have installed Ant successfully!

Follow these steps to install Android SDK Tools:
The SDK Tools for Android are used by Cordova to build Android apps. Follow these steps to install the SDK Tools:
1.	Go to the page developer.android.com/sdk scroll down the page and click "VIEW ALL DOWNLOADS AND SIZES". Under "SDK Tools Only", click the windows installer exe file and download it (this file is named e.g. installer_r23.0.2-windows.exe).
2.	When downloaded, run the installer. You should do fine to use the default settings used by the installer, but make a note of the directory in which the SDK is installed, as you will have to add this to the PATH in the next step.
3.	To add the SDK Tools to the PATH, open the Control Panel, click System and Security, click System, click Change settings, click the Advanced tab, then click the Environment Variables button.
4.	In the list User variables select PATH and click the Edit button.
5.	At the end of the field Variable value, add a semicolon followed by the path to the tools and platform-tools directores of the Android SDK install. Here is an example of what to add (note that there are two paths in one line, separated by a semicolon): 
;C:\Users\miki\AppData\Local\Android\android-sdk\tools;C:\Users\miki\AppData\Local\Android\android-sdk\platform-tools
You can prepare the path in a text editor, copy it and paste at the end of the input field. Click the OK button when done.
6.	Click the OK button again to close the Environment Variables window.
7.	Now test the install. Close any open command windows, open a new command window and type: 
$ adb version
This should display the version of the Android Debug Bridge.
8.	As the final step, you need to get the specific Android SDK version used by Cordova. This is done by running the Android SDK Manager by typing the command: 
$ android
This launches a window where you can select to install specific Android SDKs.
9.	First time you launch the Android SDK Manager there will be preset selections. It is recommended to leave these untouched. Also select the entry "Android 4.4.2 (API 19)". This is the version used by the current Cordova 3.5 version. Note that the Android SDK required by Cordova will change in the future, as new versions of Cordova and Android are released. When this happens, open the Android SDK Manager again, and install the required API version(s).

To install Ionic:
Open Git Bash.
To install globally it, simply run:
$ npm install -g ionic

Creating the project:
Go to the folder where you put your projects.
To create a new Cordova project with tabs template:
$ ionic start AssessmentApp tabs

To add the additional plugins:
- To display PDF files:
$ bower install pdfmake angular-pdf --save
- To get access to device’s sensors:
$ cordova plugin add https://github.com/fabiorogeriosj/cordova-plugin-sensors.git
- To get geo-location data:
$ cordova plugin add cordova-plugin-geolocation
-	To get motion data:
$ cordova plugin add cordova-plugin-device-motion

Now, we need to tell ionic that we want to enable the iOS and Android platforms. Note: unless you are on MacOS, leave out the iOS platform:
$ ionic platform add ios
$ ionic platform add android

The application is built for all the added platforms after you are done coding by the following. You can limit the scope of the build process by specifying the name of the platform for which you want to build the application
$ ionic build [ios|android]

To transfer the testing application to an android device, use:
$ adb install -r platforms/android/build/outputs/apk/android-debug.apk

To monitor the log file after running to debug the application, use:
$ adb logcat

To edit the code, different editors can be used including Sublime Text 3 or nodepad++.
 
Developing the core
--------------------
On the core side, four main components are: NodeJS application, CouchDB server, R engine, and MQTT broker.
NodeJS application
The first step is to install NodeJS from https://nodejs.org/en/. Once it has been installed, Sublime can be used for developing the application. The packages required for the application are:
•	nano: to communicate with CouchDB
•	mqtt: to create MQTT publishers and subscribers
•	http: to communicate with the R engine via http requests
•	express: for http server functionalities
•	fs: to access the file system on the devices
•	json2csv: to convert the JSON files received via mqtt to csv and append them to the csv file
•	sleep**: only for simulation purposes
All of the packages can be downloaded using the command: >npm install <package name>

- CouchDB server
A local CouchDB server can be downloaded and installed from http://couchdb.apache.org/. The server runs on port 5984 and can be accessed immediately after installation via curl. The database can also be accessed via the graphic interface provided by Futon by typing http://localhost:5984/_utils/ into a web browser. Futon offers a simple method to access databases and generate views that can later be called from the NodeJS application.

- R engine
An R engine can be downloaded and installed from https://www.r-project.org/. The initial installation supports various types of analysis and graphical representations. However, to enable communication between NodeJS and the R engine, an additional library should be provided. The library needed is httpuv; which provides a low-level socket and protocol support for handling HTTP and WebSocket requests directly from within R. The library is built on top of the libuv and http-parser C libraries. To install the library, type the following command into the console in the R environment:
install.packages("httpuv")

- Mosquitto
The MQTT broker of choice for evaluation purposes is Mosquitto. It can be installed from http://mosquitto.org/ and comes with a simple publisher and subscriber for testing. 

- HiveMQ
The MQTT broker of choice system deployment purposes is HiveMQ. It can be installed from http://www.hivemq.com/ and comes with a simple publisher and subscriber for testing. 

**********************************************************************************************
The sample clients sim_student.js, sim_teacher_analysis.js, and sim_teacher_quiz.js can be used to test the system.
In the client file sim_student.js, the code has been modified to simulate multithreading. For that, jxcore is required.

The steps to install jxcore can be found in https://github.com/jxcore/jxcore
after installing, simply run the student client using the command
> jx sim_student.js
you may also modify the code for sim_student.js and control the number of threads, and the number of tasks added to every thread.
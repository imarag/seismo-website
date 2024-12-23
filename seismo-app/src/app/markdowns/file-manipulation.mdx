# Introduction

Python is a multitasking programming language. There are many tasks that someone can accomplish by using it. Among the various libraries, tools, and functions available, Python is also great at manipulating files. It provides multiple libraries for file path handling, regular expression matching, creating, removing, renaming folders and files, searching directories, listing the content of folders and files, checking the existence of files, and more. Some of the most popular libraries used for this purpose are the os library, which provides a way to utilize various operating system functionalities, the pathlib library, which offers an approach to working with system paths and file manipulation, the shutil library, built on top of the os library, providing high-level file operations, and finally, the glob library, used for pattern matching. 

# Path Handling

Python offers the os and the pathlib libraries for path handling and more specifically, the os.path module and the pathlib.Path class. Given the fact that there is a confusion about various path structure naming conventions, this article presents a specific naming convention that will be used throughout the document. The file path is the whole absolute path of a file which includes the path of the directory where it is located and the name of the file with its extension. The directory path is the full absolute path of a directory and the directory name is just the name of that directory. The basename is the name of the file with its extension. The extension is also called suffix. We present those definitions in the image below. 

![File path segments](file-structure.png)
*File path segments*

Let's initialize the libraries that we will use throughout the rest of the tutorial: 

```py
    from pathlib import Path
    import os
    import glob
    import shutil
```

## Python os library

 The os.path module provides functionality for managing file paths. Let's explore the diverse capabilities it offers for manipulating these path components:

- os.getcwd(), returns the current working directory as a string
- os.path.basename(path), retrieves the final segment of a path that does not finish with a path separator character
- os.path.dirname(path), returns the path up to the last segment that ends with a path separator character
- os.path.split(path), returns a tuple with the basename and the dirname of the given path (dirname, basename)
- os.path.splitext(path), splits a file path into the file path without its extension and the file extension
- os.path.join(path, *path), joins multiple path components into a single path
- os.path.exists(path), checks if a path exists
- os.path.isdir(path), checks if the given path points to a directory
- os.path.isfile(path), checks if the given path points to a file

## os.getcwd()

This function returns the current absolute working directory of your Python script as a string.

```py
    print(os.getcwd())
```

## os.path.basename(path)

Extract the base name of a file path. In other words, it is the last segment of a path that does not conclude with a path separator character.

```py 
    print(os.path.basename("c:/Users/User/Desktop/myfile.txt"))
    print(os.path.basename("c:/Users/User/Desktop"))
    print(os.path.basename("c:/Users/User/Desktop/"))

    # Output:

    # myfile.txt
    # Desktop
    #
```

## os.path.dirname(path)

This function essentially extracts everything from the beginning of the path up to the last path component with a path separator at its end. However, it will remove the last forward slash when it finds it. This is the directory path described above without the forward slash at the end.

```py 
    print(os.path.dirname("c:/Users/User/Desktop/myfile.txt"))
    print(os.path.dirname("c:/Users/User/Desktop"))
    print(os.path.dirname("c:/Users/User/Desktop/"))

    # Output:

    # c:/Users/User/Desktop
    # c:/Users/User
    # c:/Users/User/Desktop
```

## os.path.split(path)

This function takes the path as input and returns a tuple with os.path.dirname as the first element and os.path.basename as the second element.

```py 
    dir_name, bs_name = os.path.split("c:/Users/User/Desktop/myfile.txt")
    print(dir_name, bs_name)

    # Output:

    # c:/Users/User/Desktop myfile.txt
```

## os.path.splitext(path)

This function is used to split a file path into the file path without its extension and the file extension (including the dot). In other words, it splits the path into a part up to the dot of the file (if there is a file) and a part that includes the dot and the extension. If there is no extension, the second returned element will be empty.

```py 
    print(os.path.splitext("c:/Users/User/Desktop/myfile.txt"))
    print(os.path.splitext("c:/Users/User/Desktop/myfile"))

    # Output: 

    # ('c:/Users/User/Desktop/myfile', '.txt')
    # ('c:/Users/User/Desktop/myfile', '')
```

## os.path.join(path, *path)

This function is used to join one or more path components together to create a valid file path. The return value is a concatenation of all the provided components. This function, ensures that your code works correctly on different platforms, handles both absolute and relative paths and makes the code more readable and cleaner.

```py 
    print(os.path.join("c:/Users/User", "Desktop", "new_folder/myfile.txt"))
    print(os.path.join("c:/Users/User", "Desktop", "myfile.txt"))
    print(os.path.join("c:/Users", "User/Desktop", "myfile.txt"))

    filename = "index.html"
    print(os.path.join("c:/Users/User", "Desktop", filename))

    # output:

    # c:/Users/User\Desktop\new_folder/myfile.txt
    # c:/Users/User\Desktop\myfile.txt
    # c:/Users\User/Desktop\myfile.txt
    # c:/Users/User\Desktop\index.html
```

## os.path.exists(path)

This function is used to check whether a file or directory exists at a given path.

```py 
    os.path.exists("c:/Users/User/Desktop/myfile.txt")
```

## os.path.isdir(path)

This function is used to check whether a given path corresponds to a directory (True) or not (False). If the provided path does not exist, it will always return False.

```py 
    os.path.isdir("c:/Users/User/Desktop/myfile.txt")
```

## os.path.isfile(path)

This function is used to check whether a given path corresponds to a file (True) or not (False). If the provided path does not exist, it will always return False.

```py 
    os.path.isfile("c:/Users/User/Desktop/myfile.txt")
```

Let's see some examples of using these functions together. Let's define a path of a file to use for the examples:

```py
    # initialize a file to use
    myfile = "c:/Users/User/Desktop/mysite/templates/login.html"
```

Start by getting the name of the parent directory of the file (directory name):

```py
    # get the name of the parent folder
    parent_dir_name = os.path.basename(os.path.dirname(myfile))
    print(parent_dir_name)

    # Output:

    # templates
```

To continue, suppose that we need to move the file inside a folder called auth that is located at the current working directory, with name "login.html" and we want to get the new file path: 

```py
    # get the new file path
    new_path = os.path.join(os.path.dirname(myfile), "auth", "login.html")
    print(new_path)

    # Output:

    # c:/Users/User/Desktop/mysite/templates\auth\login.html
```

Lastly, let's say that we need to rename that login.html file that is located in the auth folder, to login-template.html.

```py
    # create a new path of the renamed file
    new_renamed_file_path = os.path.splitext(new_path)[0]
    new_renamed_file_ext = os.path.splitext(new_path)[1]
    new_renamed_path = new_renamed_file_path + "-template" + new_renamed_file_ext
    print(new_renamed_path)

    # Output:

    # c:/Users/User/Desktop/mysite/templates\auth\login-template.html
```

There are easier ways to achieve the previous tasks. However, we do it this way for instructional purposes. 

## Python pathlib library

 As you can see the Python os library is great at handling the file paths. However, it gets really annoying sometimes when we have to write multiple functions one after another to simply get the name of a part of the path (e.g., os.path.basename(os.path.dirname(myfile))). You could import the basename and the dirname functions from the os.path module to write less code but there is a better solution to this: the Python pathlib library. It is built on top of the os library and provides an easier way to accomplish all of the previous tasks.

To use the pathlib library, wrap your file or directory path with the pathlib.Path class. When you use pathlib on a Windows system, this wraping will return a WindowsPath path object that is used to represent pathlib file paths. Similarly, it will return a PosixPath for a Linux system.

```py
    # Initialize a pathlib path by wrapping your path with the pathlib.Path class
    pathlib_path = Path(myfile)
    print(type(pathlib_path))

    # Output:

    # <class 'pathlib.WindowsPath'>
```

 Just put your path inside the pathlib.Path class and you will have access to the following pathlib functionality. Note that with "pathlib path" we refer to the returned pathlib WindowsPath in case of Windows operating system or PosixPath in case of a Linux system.

- WindowsPath.name, returns the last component of the pathlib path which is the file name with its extension, as a string
- WindowsPath.stem, provides the file name of the path without the file extension as a string
- WindowsPath.suffix, retrieves the file extension, including the period, as a string
- WindowsPath.suffixes, returns a list of file extensions for files with multiple extensions (e.g., .tar.gz)
- WindowsPath.parent, extracts the directory path of the current path as a pathlib path
- WindowsPath.parents, returns an iterator over all parent directories of the current path, as pathlib path objects
- WindowsPath.parts, generates a tuple that contains all the path components, as strings
- WindowsPath.with_suffix, returns the current pathlib path object with a modified file extension
- WindowsPath.with_name, returns the current pathlib path object with different file name
- WindowsPath.with_stem, returns the current pathlib path object with modified stem
- WindowsPath.joinpath, joins one or more path components to the current pathlib path

Let's explore these functions below to gain a deeper understanding of how they are used. Because of my Windows operating system, i will use WindowsPath as the pathlib path. 

## Pathlib Path path segments

- WindowsPath.name
- WindowsPath.stem
- WindowsPath.suffix
- WindowsPath.suffixes
- WindowsPath.parent
- WindowsPath.parents
- WindowsPath.parts

The WindowsPath.name attribute returns the last component of the path, which is typically the file name with the extension. The WindowsPath.stem attribute returns the file name without the file extension. The WindowsPath.suffix outputs the file extension, including the period ('.'). Use the WindowsPath.suffixes in cases where a file has multiple extensions (e.g., .tar.gz). In addition to these, the WindowsPath.parent extracts the parent directory or the directory path of the current path. Then utilize the WindowsPath.parents to return an iterator over all the parent directories from the current path to the root. Lastly, apply the WindowsPath.parts to get a tuple of all the components in the path.

```py
    mypath = Path("c:/Users/User/Desktop/myfile.txt")
    print("mypath.name:", mypath.name)
    print("mypath.stem:", mypath.stem)
    print("mypath.suffix:", mypath.suffix)
    print("mypath.parent:", mypath.parent)
    print("mypath.parents:", mypath.parents)
    print("mypath.parts:", mypath.parts)
    print("list(mypath.parents):", list(mypath.parents))

    # Output:

    # mypath.name:  myfile.txt
    # mypath.stem:  myfile
    # mypath.suffix:  .txt
    # mypath.parent:  c:\Users\User\Desktop
    # mypath.parents:  <WindowsPath.parents>
    # mypath.parts:  ('c:\\', 'Users', 'User', 'Desktop', 'myfile.txt')
    # list(mypath.parents):  [WindowsPath('c:/Users/User/Desktop'), WindowsPath('c:/Users/User'), WindowsPath('c:/Users'), WindowsPath('c:/')]
```

## Pathlib Path change segments

- WindowsPath.with_stem(new_stem)
- WindowsPath.with_name(new_name)
- WindowsPath.with_suffix(new_suffix)

The WindowsPath.with_stem(new_stem) creates a new WindowsPath object with the same path as the original but with a modified stem (new_stem). This is useful for renaming files while keeping the same directory and extension intact. Similarly, the WindowsPath.with_name(new_name) creates a modified path with new_name as its new name. Lastly, the WindowsPath.with_suffix(new_suffix) keeps the original path but modifies the file extension with new_suffix.

```py
    mypath = Path("c:/Users/User/Desktop/myfile.txt")
    print('initial path:', mypath)
    print('with_suffix(".png"): ', mypath.with_suffix(".png"))
    print('with_stem("another_file"): ', mypath.with_stem("another_file"))
    print('with_name("another_file.csv"): ', mypath.with_name("another_file.csv"))

    # Output:

    # initial path:  c:\Users\User\Desktop\myfile.txt
    # with_suffix(".png"):  c:\Users\User\Desktop\myfile.png
    # with_stem("another_file"):  c:\Users\User\Desktop\another_file.txt
    # with_name("another_file.csv"):  c:\Users\User\Desktop\another_file.csv
```

## Pathlib join path

- WindowsPath.joinpath(other)

The WindowsPath.joinpath is a method for creating a new path by joining one or more components to an existing pathlib path object (WindowsPath or PosixPath). An alternative to WindowsPath.joinpath is using the forward slash character ('/'). You need to have at least one pathlib path and one or more Python strings to join them together.

```py
    print('c:/Users' / Path('user') / 'Desktop' / 'myfile.txt')
    print('c:/Users' / Path('user') / 'Desktop' / Path('myfile.txt'))
    print(Path('c:/Users') / 'user' / 'Desktop' / 'myfile.txt')
    print(Path('c:/Users') / Path('user') / Path('Desktop') / Path('myfile.txt'))

    # Output:

    # c:\Users\user\Desktop\myfile.txt
    # c:\Users\user\Desktop\myfile.txt
    # c:\Users\user\Desktop\myfile.txt
    # c:\Users\user\Desktop\myfile.txt
```

Other functionality similar to the os library includes the WindowsPath.exists() to check if a file or directory exists, the pathlib.Path.cwd() and pathlib.Path.home() to get the current working directory and the user's home directory, the WindowsPath.is_dir() and WindowsPath.is_file() to check whether a path points to a file or a directory and lastly the WindowsPath.as_posix() to convert the windows backslashes ("\") to forward slashes ("/"). Check the documentation for more information. 

# Managing Files and Folders

During the path handling we used the python os and pathlib libraries to manipulate file and directory paths. These libraries in combination with other (e.g., shutil) can also be used effectively to create, move, copy and rename files and folders. Some of the most important functions are listed below:

- os.mkdir(path), creates a new directory specified by path
- os.chdir(path), changes the current working directory to path
- os.makedirs(path, exist_ok=False), creates any necessary parent directories to complete the path
- os.rmdir(path), removes the directory specified by path if it's empty. Use shutil.rmtree if not
- shutil.rmtree(path, ignore_errors=False), recursively removes a non-empty directory specified by path. Use ignore_errors=True to ignore any errors during the removal
- shutil.move(src, dst), moves a file or directory from src to dst
- shutil.copyfile(src, dst), copy only the content of a file from src to dst, without preserving any metadata (file size, creation timestamp, modification timestamp etc.)

Utilize the shutil.copyfile(src, dst) to copy only the content of the file. Use shutil.copy(src, dst), to copy a file from src to dst while preserving its content and permissions but not its metadata. In order to copy a file from src to dst while preserving both its content and metadata, use the shutil.copy2(src, dst). Lastly, utilize the shutil.copytree(src, dst), to recursively copy a directory and its content from src to dst. 

To enhance understanding, let's illustrate the preceding functions with examples. Suppose we want to build the following file structure shown at the figure below: 

![An example of a file structure](path_structure.png)
*An example of a file structure*

Let's check our current working directory:

```py
    # get the current working directory
    print(os.getcwd())

    # Output:

    # c:\Users\Ioannis\Desktop
```

Begin by creating a root folder named MyProject in the current working directory and navigate into it. If it already exists, delete it: 

```py
    # if the folder exists, delete it
    if os.path.exists("C:/Users/Ioannis/Desktop/Myproject"):
        shutil.rmtree("C:/Users/Ioannis/Desktop/Myproject")

    # create the "MyProject" folder and change the directory inside it
    os.mkdir("C:/Users/Ioannis/Desktop/Myproject")
    os.chdir("C:/Users/Ioannis/Desktop/Myproject")
```

Now get the current working directory again: 

```py
    # get the current working directory
    print(os.getcwd())

    # Output:

    # C:\Users\Ioannis\Desktop\Myproject
```

Create the Static and the Templates folders inside the MyProject root folder:

```py
    # create the "Static" and "Templates" folders
    os.mkdir("Static")
    os.mkdir("Templates")
```

Use the os.listdir(path) function to list the content of a folder. Use a dot (".") to denote the current working directory and the double dot ("..") to signify the parent directory. If you don't provide any path, it will list the content of the current working directory. This function will show the file and the directory names inside the specified path. 

```py
    # list the contents of the "MyProject" folder
    os.listdir(".")

    # Output:

    # ['Static', 'Templates']
```

I have some necessary files in a folder named myfiles, located in a different directory in my machine. For this reason, I will move this folder into the MyProject directory to use the files later. 

```py
    # list the "MyProject" folder
    # we will see the two previously created, folders
    # and the "myfiles" folder with the available files
    os.listdir()

    # Output:

    # ['myfiles', 'Static', 'Templates']
```

Check the content of the myfiles folder:

```py
    # list the "myfiles" folder
    os.listdir("myfiles")

    # Output:

    # ['about.html',
    # 'about.png',
    # 'index.html',
    # 'index.js',
    # 'login.html',
    # 'main.css',
    # 'site-logo.svg']
```

At this point we can start building the root directory structure by moving the files to their respective folders. Continue, with the index.html and the about.html files: 

```py
    # move the index.html and the about.html files in the "Templates" folder
    shutil.move("myfiles/index.html", "Templates")
    shutil.move("myfiles/about.html", "Templates")
```

Let's see the content of the Templates folder now: 

```py
    # list the "Templates" folder
    os.listdir("Templates")

    # Output:

    # ['about.html', 'index.html']
```

Create the respective sub-folders: 

```py
    # create a folder called "AUTH" inside the "Templates" folder
    os.mkdir("Templates/AUTH")
```

And move the respective files from the myfiles folder, in the AUTH folder:  

```py
    # move the "login.html" file in the "AUTH" folder
    shutil.move("myfiles/login.html", "Templates/AUTH")
```

Now we need another file called register.html that it is going to be similar to the login.html file. For this reason make a copy of the login.html file in the AUTH folder with name register.html: 

```py
    # copy the "login.html" in the same folder ("AUTH") with name "register.html"
    shutil.copyfile("Templates/AUTH/login.html", "Templates/AUTH/register.html")
```

Check the content of the AUTH folder now:

```py
    # check the content of the "AUTH" folder
    os.listdir("Templates/AUTH")

    # Output:

    # ['login.html', 'register.html']
```

Now change the current workin directory inside the Static folder and create the three folders shown in the image (Images, Javascript, CSS):

```py
    # change the current directory to the "Static" folder
    os.chdir("Static")
```

```py
    # create the three folders
    os.mkdir("Images")
    os.mkdir("Javascript")
    os.mkdir("CSS")
```

List the content of the Static folder: 

```py
    # list the "Static" folder content
    os.listdir(".")

    # Output:

    # ['CSS', 'Images', 'Javascript']
```

Move the rest of the files into its corresponding folders:  

```py
    # move the rest files
    shutil.move("../myfiles/site-logo.svg", "Images")
    shutil.move("../myfiles/about.png", "Images")
    shutil.move("../myfiles/index.js", "Javascript")
    shutil.move("../myfiles/main.css", "CSS")
```

Lastly, check the content of these three folders:   

```py
    # list the content of the created folders
    os.listdir("Images")
    os.listdir("Javascript")
    os.listdir("CSS")
    
    # Output:

    # ['about.png', 'site-logo.svg']
    # ['index.js']
    # ['main.css']
```

We don't need the myfiles folder inside the MyProject root folder now. Remove it:  

```py
    # now delete the "myfiles" folder that is located in the "MyProject" folder
    # if the folder is not empty use the rmtree command
    # else use the rmdir command

    if os.listdir("../myfiles"):
        shutil.rmtree("../myfiles")
    else:
        os.rmdir("../myfiles")
```

# Listing and searching folders

 While creating the file structure earlier, we utilized the os.listdir(path) function to enumerate the contents of a folder. This allowed us to retrieve the names of all files and sub-folders within the specified folder path. Nonetheless, glob, os and pathlib libraries offer additional functions for this purpose. Let's explore these alternatives below:

- os.listdir(path), returns a list of file names and sub-directory names in the specified directory (path)
- glob.glob(path), returns a list of file paths that match the specified path pattern
- Path.iterdir(path), returns an iterator over the entries (both files and directories) in the current directory specified by path

## os.listdir(path)

This command is used in Python to list the files and directories within a directory specified by the path parameter. It returns a list of strings, where each string represents the name of a file or directory in the specified path

```py
    os.listdir("c:/Users/User/Desktop/")
``` 

## glob.glob(path)

This command is used to search for files and directories that match a specified path pattern using the glob-style wildcard characters (e.g., * for matching any characters and ? for matching a single character). It returns a list of absolute file paths as strings that match the given pattern. The glob module is used for this operation, and it allows you to perform more advanced pattern-based searches within directories. Use recursive=True to recursively search the whole directory in depth. If recursive is True, the pattern '**' will match any files and zero or more directories, subdirectories.

```py
    pattern = "*.txt"
    matching_files = glob.glob(pattern)

    for file_path in matching_files:
        print(file_path)
``` 

## Path.iterdir()

This command is part of the pathlib module in Python, which provides a modern and more object-oriented approach to working with filesystem paths. When called on a Path object (e.g., Path('some_directory')), it returns an iterator that yields Path objects representing both files and directories in the current directory specified by that Path object.

```py
    pathlib_path = Path("path_to_directory")

    for item in pathlib_path.iterdir():
        if item.is_file():
            print(f"File: {item}")
        elif item.is_dir():
            print(f"Directory: {item}")
``` 
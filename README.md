Alfresco Share Enhanced Security Labelling Module
=================================================

### Summary

This module adds Enhanced Security Labelling to a Alfresco Share.

### Static Analysis Standards

As an experiment, we are passing our javascript code through gjslint.  We're using the following code to do so:

for f in `find ~/git/alfresco-share-esl/ -name *js`; do gjslint --nojsdoc --max_line_length 1000 --disable 0005,0200,0216,0213 $f; done

To count the errors, we are using:

for f in `find ~/git/alfresco-share-esl/ -name *js`; do gjslint --nojsdoc --max_line_length 1000 --disable 0005,0200,0216,0213 $f | grep ^Line ; done | wc -l

Although not yet an absolute requirement, contributors are strongly encouraged not to check in any changes that increase the reported warnings from gjslint.  This may become an absolute requirement in the future.  As of 23/8/13, there are 87 reported warnings.
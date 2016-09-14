#! /bin/bash

for i in `cat kill_ez_dev.pids`; do kill $i; done

#!/bin/bash

# Define source and destination directories
ICONS_SRC="node_modules/@eveshipfit/data/dist/icons"
SDE_SRC="node_modules/@eveshipfit/data/dist/sde"
STATIC_DIR="static"

# Create destination directories if they don't exist
mkdir -p $STATIC_DIR/icons
mkdir -p $STATIC_DIR/sde

# Copy files
cp -r $ICONS_SRC/* $STATIC_DIR/icons/
cp -r $SDE_SRC/* $STATIC_DIR/sde/

echo "Assets copied to static directory."

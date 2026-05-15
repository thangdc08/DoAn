package com.badminton.identityservice.service.impl;

import com.badminton.identityservice.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    private final com.cloudinary.Cloudinary cloudinary;

    @Override
    public String uploadAvatar(MultipartFile file) throws IOException {
        java.util.Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), 
                com.cloudinary.utils.ObjectUtils.asMap(
                    "folder", "badminton/avatars",
                    "resource_type", "auto"
                ));
        
        return uploadResult.get("secure_url").toString();
    }
}

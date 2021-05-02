package ir.ac.sbu.evaluation.service.user;

import ir.ac.sbu.evaluation.dto.user.admin.AdminDto;
import ir.ac.sbu.evaluation.repository.user.AdminRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public AdminDto retrieve(long userId) {
        return AdminDto.from(adminRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found: ID = " + userId)));
    }
}
